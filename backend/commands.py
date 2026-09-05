import click
from flask.cli import with_appcontext

from extensions import db
from models import User, UserRole


@click.command("create-admin")
@click.option("--username", prompt="Admin username")
@click.option("--email", prompt="Admin email")
@click.option("--password", prompt=True, hide_input=True, confirmation_prompt=True)
@with_appcontext
def create_admin(username, email, password):

    username = username.strip()
    email = email.strip().lower()

    existing_user = User.query.filter(
        (User.username == username) |
        (User.email == email)
    ).first()

    if existing_user:
        click.echo("A user with this username or email already exists.")
        return

    admin = User(
        username=username,
        email=email,
        phone=None,
        role=UserRole.ADMIN,
        is_active=True,
    )

    admin.set_password(password)

    db.session.add(admin)
    db.session.commit()

    click.echo(f"Admin '{username}' created successfully.")