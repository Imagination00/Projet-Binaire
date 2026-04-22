from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def accueil():
    """Affiche la page principale du convertisseur."""
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
