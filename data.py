import os, json, datetime

faces = {
    "1" : "assets/faces/1.png",
    "2" : "assets/faces/2.png",
    "3" : "assets/faces/3.png",
    "4" : "assets/faces/4.png",
    "5" : "assets/faces/5.png",
}
weather = {
    "sunny" : "assets/weather/sun_3d.png",
    "cloudy" : "assets/weather/cloud_3d.png",
    "raining" : "assets/weather/cloud_with_rain_3d.png",
    "snowing" : "assets/weather/cloud_with_snow_3d.png",
    "stormy" : "assets/weather/cloud_with_lightning_and_rain_3d.png",
}
week = {
    "Monday" : "Lundi",
    "Tuesday" : "Mardi",
    "Wednesday" : "Mercredi",
    "Thursday" : "Jeudi",
    "Friday" : "Vendredi",
    "Saturday" : "Samedi",
    "Sunday" : "Dimanche"
}
month = {
    "January" : "Janvier",
    "February" : "Février",
    "March" : "Mars",
    "April" : "Avril",
    "May" : "Mai",
    "June" : "Juin",
    "July" : "Juillet",
    "August" : "Août",
    "September" : "Septembre",
    "October" : "Octobre",
    "November" : "Novembre",
    "December" : "Décembre"

}

def initialize_data():
    if not os.path.exists("data.json"):
        with open("data.json", "w") as file:
            json.dump({
                    "settings": {
                        "secret_key": "REPLACE THE SECRET KEY HERE",
                        "invitation_code": "REPLACE THE SECRET INVITATION CODE HERE",
                        "ip": "REPLACE THE IP HERE, EXAMPLE : 192.168.1.42"
                    },
                    "data": []
                }, file, indent=4)
        exit("Please replace the secret key and the invitation code in the data.json file.")

def get(type="data"):
    with open("data.json", "r") as file:
        data = json.load(file)
    if type == "all":
        return data
    return data[type]

def known_username(username):
    users = get()
    for i in users:
        if i["username"] == username:
            return True
    return False

def correct_auth(username, password):
    users = get()
    for i in users:
        if i["username"] == username:
            if i["password"] == password:
                return True
    return False

def get_journal(username):
    users = get()
    for i in users:
        if i["username"] == username:
            return i["journal"]
    return False

def save(list_users):
    all_data = get("all")
    all_data["data"] = list_users
    with open("data.json", "w", encoding="utf-8") as file:
        json.dump(all_data, file, indent=4)

def new_user(username, password):
    users = get()
    users.append({"username" : username, "password" : password, "journal" : []})
    save(users)

def get_30_last_days():
    days = []
    for i in range(30):
        days.append((datetime.date.today() - datetime.timedelta(days=i)).strftime("%d/%m/%Y"))
    return days

def get_30_passed_days(username):
    journal = get_journal(username)
    days = get_30_last_days()
    passed_days = []
    for day in days:
        found = False
        for entry in journal:
            if entry["date"] == day:
                passed_days.append(entry)
                found = True
                break
        if not found:
            passed_days.append({"date": day,"face": None,"weather": None,"title": None,"text": None})
    return passed_days