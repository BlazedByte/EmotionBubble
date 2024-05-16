from flask import Flask, render_template, request, session, redirect, flash
import datetime
import hashlib
import data

app = Flask(__name__)

data.initialize_data()

def is_connected():
    if session.get("username") == None:
        return False
    return True

@app.route('/')
def index():
    if is_connected():
        return redirect('/journal')
    return redirect('/need_login')

@app.route('/journal')
def journal():
    if not is_connected():
        return redirect('/need_login')
    jours = data.get_30_passed_days(session.get("username"))

    for jour in jours:
        if jour['face'] != None:
            jour["date_nf"] = jour["date"]
            date = jour["date"]
            date = date.split("/")
            datetime_object = datetime.datetime(int(date[2]), int(date[1]), int(date[0]))
            day_name = data.week[datetime_object.strftime("%A")]
            month_name = data.month[datetime_object.strftime("%B")]
            jour["date"] = day_name + datetime_object.strftime(" %d ") + month_name + datetime_object.strftime(" %Y")
            jour["face"] = data.faces[jour["face"]]
            jour["weather"] = data.weather[jour["weather"]]

    return render_template('index.html',
                           today=jours[0],
                           jours=jours[1:],
                           user_name=session.get("username"))

@app.route('/historique')
def historique():
    if not is_connected():
        return redirect('/need_login')
    jours_dict = data.get_journal(session.get("username"))

    jours = []
    for date, jour in jours_dict.items():
        jours.append(jour)

    for jour in jours:
        if jour['face'] != None:
            jour["date_nf"] = jour["date"]
            date = jour["date"]
            date = date.split("/")
            datetime_object = datetime.datetime(int(date[2]), int(date[1]), int(date[0]))
            day_name = data.week[datetime_object.strftime("%A")]
            month_name = data.month[datetime_object.strftime("%B")]
            jour["date"] = day_name + datetime_object.strftime(" %d ") + month_name + datetime_object.strftime(" %Y")
            jour["face"] = data.faces[jour["face"]]
            jour["weather"] = data.weather[jour["weather"]]

    return render_template('historique.html',
                           jours=jours,
                           user_name=session.get("username"))

@app.route('/connexion', methods=['POST'])
def authentification():
    username = request.form.get('username', '')
    password = request.form.get('password', '')
    if not username or not password:
        return render_template('login.html', error="Veuillez remplir tous les champs")
    password = hashlib.sha256(password.encode()).hexdigest()
    test = data.correct_auth(username, password)
    if test != False:
        session["username"] = username
        return redirect('/journal')
    else:
        session.clear()
        return render_template('login.html', error="Les informations transmises ne nous on pas permis de vous authentifier. Veuillez réessayer.")

@app.route('/deconnexion')
def deconnexion():
    session.clear()
    return redirect('/need_login')

@app.route('/need_login')
def need_login():
    return render_template('login.html')

@app.route('/need_signup')
def need_signup():
    return render_template('signup.html')

@app.route('/inscription', methods=['POST'])
def inscription():
    username = request.form.get('username', '')
    password = request.form.get('password', '')
    invitation = request.form.get('invitation_code', '')
    if not username or not password or not invitation:
        return render_template('login.html', error="Veuillez remplir tous les champs")
    if invitation == SETTINGS["invitation_code"]:
        if not data.known_username(username):
            if len(username) < 4:
                return render_template('signup.html', error="Votre nom d'utilisateur doit contenir au moins 4 caractères.")
            if len(password) < 8:
                return render_template('signup.html', error="Votre mot de passe doit contenir au moins 8 caractères.")
            password = hashlib.sha256(password.encode()).hexdigest()
            data.new_user(username, password)
            session["username"] = username
            return redirect('/journal')
        else:
            return render_template('signup.html', error="Ce nom d'utilisateur n'est pas disponible.")
    else:
        return render_template('signup.html', error="Le code d'invitation est incorrect.")

@app.route('/new')
def new():
    if not is_connected():
        return redirect('/need_login')
    return render_template('new_record.html')

@app.route('/new_record', methods=['POST'])
def new_record_post():
    if not is_connected():
        return redirect('/need_login')
    date = request.form['date'].split("-")
    date = datetime.datetime(int(date[0]), int(date[1]), int(date[2]))
    if int(str(date.strftime("%Y%m%d"))) > int(str(datetime.datetime.now().strftime("%Y%m%d"))):
        return render_template('new_record.html', error="La date ne peut pas être dans le futur.")
    date = date.strftime("%d/%m/%Y")
    if data.exist_record(session.get("username"), date):
        return render_template('new_record.html', error="Vous avez déjà un enregistrement pour cette date.")
    data.record_new(session.get("username"),
               {"date" : date,
                "face" : request.form['face'],
                "weather" : request.form['weather'],
                "title" : request.form['title'],
                "text" : request.form['text']})
    return redirect('/journal')

@app.route('/consulter', methods=['GET'])
def consulter():
    if not is_connected():
        return redirect('/need_login')
    
    date = request.args.get('date')
    jour = data.get_journal(session.get("username"))[date]

    if jour['face'] != None:
        jour["date_nf"] = jour["date"]
        date = jour["date"]
        date = date.split("/")
        datetime_object = datetime.datetime(int(date[2]), int(date[1]), int(date[0]))
        day_name = data.week[datetime_object.strftime("%A")]
        month_name = data.month[datetime_object.strftime("%B")]
        jour["date"] = day_name + datetime_object.strftime(" %d ") + month_name + datetime_object.strftime(" %Y")
        jour["face"] = data.faces[jour["face"]]
        jour["weather"] = data.weather[jour["weather"]]

    return render_template('view_record.html',user=jour)

@app.route('/modify', methods=['GET'])
def modify():
    if not is_connected():
        return redirect('/need_login')
    date = request.args.get('date')
    jours = data.get_journal(session.get("username"))
    if jours == False:
        return redirect('/need_login')
    return render_template('modify_record.html', jour=jours[date])

@app.route('/modification_post', methods=['POST'])
def modif_post():
    if not is_connected():
        return redirect('/need_login')
    date = request.form['date']
    data.record_modify(session.get("username"),
               {"date" : date,
                "face" : request.form['face'],
                "weather" : request.form['weather'],
                "title" : request.form['title'],
                "text" : request.form['text']})
    return redirect('/journal')

@app.route('/delete_record', methods=['GET'])
def delete():
    if not is_connected():
        return redirect('/need_login')
    date = request.args.get('date')
    data.record_delete(session.get("username"), date)
    return redirect('/journal')

@app.route('/menu')
def menu():
    if not is_connected():
        return redirect('/need_login')
    return render_template('menu.html',user_name=session.get("username"))

@app.route('/get_all_journal_data')
def get_all_journal_data():
    if not is_connected:
        return redirect('/need_login')
    jours = data.get_journal(session.get("username"))
    return jours

SETTINGS = data.get("settings")
if __name__ == '__main__':
    app.secret_key = SETTINGS["secret_key"]
    app.run(port=80, host=SETTINGS["ip"])