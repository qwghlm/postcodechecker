#!/usr/bin/env python3
import csv

ELECTION_2017_ID = 1

PLACES_FILES = {
    "WPC": "westminster"
}
RESULTS_FILES = {
    ELECTION_2017_ID: "2017 UKPGE electoral data 4"
}


def build_places():
    places_fixture = open("./fixtures/places.csv", "w")
    places = csv.DictWriter(places_fixture, ["id", "name", "type"])
    places.writeheader()

    for place_type in PLACES_FILES.keys():

        reader = csv.DictReader(open(f"./src/places/{PLACES_FILES[place_type]}.csv"))
        for line in reader:
            line["type"] = place_type
            places.writerow(line)

    places_fixture.flush()
    places_fixture.close()


def build_elections():
    elections_fixture = open("./fixtures/elections.csv", "w")
    elections = csv.DictWriter(elections_fixture, ["id", "date", "type", "name"])
    elections.writeheader()
    elections.writerow({
        "id": ELECTION_2017_ID,
        "date": "2017-06-08",
        "type": "WPC",
        "name": "2017 United Kingdom general election",
    })
    elections_fixture.flush()
    elections_fixture.close()


def build_results():
    results_fixture = open("./fixtures/results.csv", "w")
    results = csv.DictWriter(results_fixture, ["election_id", "place_id",
        "party", "surname", "first_name", "votes"])
    results.writeheader()

    for election_id in RESULTS_FILES.keys():

        reader = csv.DictReader(open(f"./src/results/{RESULTS_FILES[election_id]}.csv"))
        for line in reader:
            output_line = {
                "election_id": election_id,
                "place_id": line["ONS Code"],
                "party": line["Party Identifer"],
                "surname": line["Surname"],
                "first_name": line["First name"],
                "votes": line["Valid votes"],
            }
            results.writerow(output_line)
    results_fixture.flush()
    results_fixture.close()


def run():
    build_places()
    build_elections()
    build_results()


if __name__ == "__main__":
    run()
