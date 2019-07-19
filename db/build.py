#!/usr/bin/env python3
import csv
from datetime import datetime
import resource
import sys
from pyproj import Transformer

# NOTE: This must be downloaded from
# http://geoportal.statistics.gov.uk/datasets/ons-postcode-directory-may-2019
ONSPD_FILE = "./src/ONSPD_MAY_2019_UK.csv"

bng_to_wgs84 = Transformer.from_crs("epsg:27700", "epsg:4326")
ing_to_wgs84 = Transformer.from_crs("epsg:29903", "epsg:4326")


def run():
    """
    Parses the national postcode file into a set of database fixtures
    """
    start_time = datetime.now()

    try:
        reader = csv.DictReader(open(ONSPD_FILE))
    except FileNotFoundError:
        print(f"Must download & unzip file {ONSPD_FILE}")
        sys.exit(1)

    postcodes_fixture = open("fixtures/postcodes.csv", "w")
    postcodes = csv.DictWriter(
        postcodes_fixture, ["id", "postcode", "latitude", "longitude"]
    )
    postcodes.writeheader()

    count = 0
    for line in reader:
        if line["doterm"] or not line["oseast1m"]:
            continue
        postcode = line["pcds"]
        normalized_postcode = postcode.replace(" ", "")

        if postcode.startswith("BT"):
            latitude, longitude = ing_to_wgs84.transform(
                float(line["oseast1m"]), float(line["osnrth1m"])
            )
        else:
            latitude, longitude = bng_to_wgs84.transform(
                float(line["oseast1m"]), float(line["osnrth1m"])
            )

        postcodes.writerow(
            {
                "id": normalized_postcode,
                "postcode": postcode,
                "latitude": "{0:.6f}".format(latitude),
                "longitude": "{0:.6f}".format(longitude),
            }
        )

        count += 1
        if count % 100 == 0:
            memory = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
            sys.stdout.write(
                f"{count} postcodes done, up to {postcode}, {memory} bytes used...\r"
            )
            sys.stdout.flush()

    postcodes_fixture.flush()
    postcodes_fixture.close()

    print(f"\n{count} postcodes written")
    print(f"Time taken: {(datetime.now() - start_time)}")


if __name__ == "__main__":
    run()
