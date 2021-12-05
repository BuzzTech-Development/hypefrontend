# HYPE Frontend
## Table of Contents
- [HYPE Frontend](#hype-frontend)
  - [Table of Contents](#table-of-contents)
  - [Development Setup](#development-setup)
    - [Prerequisites](#prerequisites)
    - [Set up Back-End](#set-up-back-end)
    - [Set up Front-End](#set-up-front-end)
  - [Navigating the Admin page](#navigating-the-admin-page)
  - [Release Notes](#release-notes)
    - [Functionality](#functionality)
    - [Known Problems](#known-problems)

## Development Setup
### Prerequisites
Make sure you install or already have the following:
- Python3+ - https://www.python.org/downloads/
- Anaconda(pip + conda) - https://docs.anaconda.com/anaconda/install/index.html
- npm + node.js - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

Additionally, make sure to download both parts, the [frontend](https://github.com/BuzzTech-Development/hypefrontend) and the [backend](https://github.com/BuzzTech-Development/hypebackend). The directory structure we chose when developing looked like:

> - (some_dir)/hypeplatform
>   - .../backend
>   - .../frontend

When referring to the "root directory" in the install instructions, this means the respective folder. So the root directory of the backend would be `/(some_dir)/hypeplatform/backend/`.
  
### Set up Back-End
Let's get our environment set up. First of all create a new conda environment and name it whatever you like.
```
ripley@nostromo$ conda create --name foo_env
```
Switch to that new environment
```
ripley@nostromo$ conda activate foo_env
```
Now lets check if things look right, python should be at least 3
```
ripley@nostromo$ python3 --version
```
Navigate to the directory with the backend. Make sure you are in the root of the project. Then install all of the requirements
```
ripley@nostromo$ pip3 install -r requirements.txt
```
Create the database
```
ripley@nostromo$ python3 manage.py makemigrations
ripley@nostromo$ python3 manage.py migrate
```
We also need to set up an admin account. Run the following command, and follow the prompts.
```
ripley@nostromo$ python3 manage.py createsuperuser
```
Now you can run your server
```
ripley@nostromo$ python3 manage.py runserver
```
Now you can perform administrative functions from http://localhost:8000/admin, using the account you just created.
Alternatively you could start up the frontend and use your website.

### Set up Front-End
Navigate to the root directory of your front-end application.
Install all required packages
```
ripley@nostromo$ npm install
```
And then run your frontend using
```
ripley@nostromo$ npm start
```

> Note: it does not matter in which order you start up your front-end and back-end. Just make sure that both parts are running simultaneously in order for the application to work correctly.


## Navigating the Admin page
Go to http://localhost:8000/admin to perfrom administrative actions.

> Note: the address may be different depending on where the application is deployed. By default the pattern is (ip/localhost/domain):8000/admin.

Clicking on each of the "models", such as Cohorts, Assignments, or Users will allow you to look at the data held by each, create new entries, edit entries, or delete them. This will be useful for you if you ever need to make manual changes to the state of your platform.

For more information see https://docs.djangoproject.com/en/3.2/ref/contrib/admin/
## Release Notes
### Functionality
- Assignments
  - Teachers can create assignments
    - Includes rich text descriptions, and specification of required file types
  - Creation of an assignment automatically sends an announcement to cohort
  - Students can submit files, and add comments to assignments
    - Can see their grades for assignments
    - Can donwload previous submissions
  - Teachers are able to grade assignments
- Meetings
  - Teachers can create meetings
  - Meetings are specific to single cohorts
  - Meetings show up on the calendar page and home page
  - Meetings contain links to virtual meetings, such as Zoom or Teams
- Cohorts
  - Students can be assigned to a cohort
  - Actions can be performed upon a cohort, such as scheduling meetings, sending an announcement, or assigning an assignment.
  - Students can be moved between cohorts, and can be within multiple cohorts
- Announcements
  - Announcements can be made to cohort

### Known Problems
- Badges not implemented. There is a framework for badges to be added as rewards to assignments, but it is not complete. 
- It is not possible to message individual students currently. You can only message an entire cohort.
- There are no user defined settings.
- Guardian interaction is not complete. There is currently no way to connect a student with a guardian.

