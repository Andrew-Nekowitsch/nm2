import requests
from bs4 import BeautifulSoup

# === Configuration ===
input_file = "items_urls.txt"
class_name = "l-site-stripped__inner"

# === Read URLs from File ===
with open(input_file, "r", encoding="utf-8") as f:
    urls = [line.strip() for line in f if line.strip()]

# === Result HTML Setup ===
result_html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="style.css">
    <meta charset="UTF-8">
    <title>Extracted Elements</title>
</head>
<body>
"""

# === Process Each URL ===
for url in urls:
    try:
        print(f"Fetching: {url}")
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        element = soup.find(class_=class_name)

        if element:
            result_html += f"{str(element)}"
        else:
            result_html += f"{str(soup)}"

    except Exception as e:
        print(f"Error processing {url}: {e}")
        result_html += f"<div><h2>From {url}</h2><p>Error: {e}</p></div>\n"

# === Finalize and Write to File ===
result_html += """
</body>
</html>
"""

output_file = "items.html"
with open(output_file, "w", encoding="utf-8") as f:
    f.write(result_html)
