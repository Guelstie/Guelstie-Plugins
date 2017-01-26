# Brackets Guide
----------

## Forked Guelstie
If you forked Guelstie Plugins then you will want to clone the now forked repo to your local PC

Change `ltngames` to your github username

`git clone https://github.com/ltngames/Guelstie-Plugins`

![Clone With Command Prompt](https://github.com/Guelstie/Guelstie-Plugins/blob/dev/readme-assets/clone-repo.png)

Now you will want to add the main Guelstie repo as a new remote because origin will now point to your GitHub repo not Guelstie main repo.

![New Remote In Brackets](https://github.com/Guelstie/Guelstie-Plugins/blob/dev/readme-assets/new-remote.png)

Name it `upstream` you may name it to what you please but upstream is pretty common.

![Remote Name In Brackets](https://github.com/Guelstie/Guelstie-Plugins/blob/dev/readme-assets/remote-name.png)

When asked for a remote url use `https://github.com/Guelstie/Guelstie-Plugins.git`

![Remote URL In Brackets](https://github.com/Guelstie/Guelstie-Plugins/blob/dev/readme-assets/remote-url.png)

Be sure to fetch from all remotes before asking for a pull request and before you commit changes.

![Fetch](https://github.com/Guelstie/Guelstie-Plugins/blob/dev/readme-assets/fetch-remotes.png)

Stage your local chnages before you commit them, select the little checkbox beside the Commit button then click the commit button to commit local changes.

![Stage Changes](https://github.com/Guelstie/Guelstie-Plugins/blob/dev/readme-assets/stage-changes.png)

Then push changes to your forked project

![Push To Your Repo](http://link)

The last step is to visit https://github.com/Guelstie/Guelstie-Plugins and submit a new Pull Request

## Warning ESLint for Brackets
For Latest ESLint for brackets you need to install [Brackets NPM Registry](https://github.com/zaggino/brackets-npm-registry)

Once installed open The NPM Registry and install ESLint package