set -x PROJECTS heroku-apps heroku-certs heroku-ci heroku-cli-addons heroku-cli-oauth heroku-container-registry heroku-fork heroku-git heroku-hello-world heroku-local heroku-orgs heroku-pg heroku-pipelines heroku-ps-exec heroku-redis heroku-run heroku-spaces heroku-status heroku-sudo

for P in $PROJECTS
  cd $P
	yarn
	cd ~/Heroku
end

