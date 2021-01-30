import json

with open("batismos.json", "r+") as f:
    data = json.load(f)

    for idx, entry in enumerate(data):
        entry["pai"] = entry["title"].split("Pai:")[1].strip().split(";")[0].strip()
        entry["mae"] = (
            entry["title"]
            .split("Pai:")[1]
            .strip()
            .split(";")[1]
            .strip()
            .split("Mãe:")[1]
            .strip()
        )
        entry["_id"] = entry["ref"].replace("/", "_")

    f.seek(0)
    json.dump(data, f, indent=4, ensure_ascii=False)
    f.truncate()
