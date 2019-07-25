#!/usr/bin/env python3
import csv

PLACES_FILES = {"westminster": "WPC"}


def build_places():
    places_fixture = open("./fixtures/places.csv", "w")
    places = csv.DictWriter(places_fixture, ["id", "name", "type"])
    places.writeheader()

    for filename in PLACES_FILES.keys():

        reader = csv.DictReader(open(f"./src/places/{filename}.csv"))
        for line in reader:
            line["type"] = PLACES_FILES[filename]
            places.writerow(line)

    places_fixture.flush()
    places_fixture.close()


def run():
    build_places()


if __name__ == "__main__":
    run()
