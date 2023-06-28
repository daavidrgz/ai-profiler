import argparse
import json

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=str, required=True)
    parser.add_argument("--output", type=str, required=True)
    args = parser.parse_args()

    with open(args.input, "r") as f:
        lines = f.readlines()

    with open(args.output, "w") as f:
        for line in lines:
            lx = json.loads(line)

            birthyear = lx["birthyear"]
            current_year = 2023
            age = current_year - birthyear
            if age < 18:
                lx["age"] = "XX-17"
            elif age < 25:
                lx["age"] = "18-24"
            elif age < 35:
                lx["age"] = "25-34"
            elif age < 50:
                lx["age"] = "35-49"
            else:
                lx["age"] = "50-XX"

            del lx["birthyear"]

            f.write(json.dumps(lx) + "\n")
