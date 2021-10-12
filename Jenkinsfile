node {

   def branch = 'master'
   def version
   def sshKeyId = 'ssh_dev'
   def deploymentServer = 'dean@deant.work'
   def serviceName = 'star-wars-client'
   def deploymentPath = "/opt/apps/${serviceName}"
   def gitCredentials = 'ci_checkout'
   def dockerRegistry = "ghcr.io/deantawonezvi/star-wars-client"
   def slackToken = "slackToken"
try {
  slackSend color: "warning", message: "Build Started - ${serviceName} (Build #${env.BUILD_NUMBER}) (<${env.BUILD_URL}|Open>)", channel: "star-wars-build-updates"


   stage('SCM') {
      git url: "https://github.com/deantawonezvi/star-wars-client"
      branch: "master"
    }


   stage("Config vars") {
        def props = readProperties file: 'docker/.env'
        version = props['APP_VERSION']

        println("Version: " + version)
        println("Branch: " + branch)
        println("Deployment path: " + deploymentPath)

   }

   docker.withRegistry('https://ghcr.io', gitHubCredentials) {

   def dockerImage;

   stage('DOCKER IMAGE') {
      dockerImage = docker.build("$dockerRegistry:$branch-$version", "-f Dockerfile .")
   }

   stage('DOCKER PUSH') {
      dockerImage.push()
   }

   stage("CLEANUP") {
       sh "docker rmi $dockerRegistry:$branch$version || true"
     }
   }

    stage('DEPLOY DIR') {
        sshagent([sshKeyId]) {
            sh "ssh -o StrictHostKeyChecking=no -p 22 $deploymentServer mkdir /opt/apps/$serviceName || true"
        }
    }

    stage('DEPLOY ENV FILE') {
        sshagent([sshKeyId]) {
            sh "scp docker/.env $deploymentServer:$deploymentPath/"
        }
    }

    stage('DEPLOY DOCKER-COMPOSE') {
        sshagent([sshKeyId]) {
            sh "scp docker/docker-compose.yml docker/docker-compose.sh $deploymentServer:/opt/apps/${serviceName}/"
        }
    }

    stage('DEPLOY RUN SCRIPT') {
        sshagent([sshKeyId]) {
            sh "ssh -o StrictHostKeyChecking=no -p 22 $deploymentServer chmod +x /opt/apps/${serviceName}/docker-compose.sh"
        }
    }

    stage('DOCKER RUN') {
        retry(3) {
            sshagent([sshKeyId]) {
                sh "ssh -o StrictHostKeyChecking=no -p 22 $deploymentServer 'cd /opt/apps/${serviceName} && ./docker-compose.sh'"
            }
        }
    }
  stage('RESET WORKSPACE') {
       sh 'rm -rf .* * &>/dev/null || true'
   }
      slackSend color: "good", message: "Build Succeeded! - ${serviceName} (Build #${env.BUILD_NUMBER}) (<${env.BUILD_URL}|Open>)", channel: "star-wars-build-updates"

   }catch (err) {
   slackSend color: "danger", message: "BUILD FAILED! - ${serviceName} (Build #${env.BUILD_NUMBER}) (<${env.BUILD_URL}|Open>)", channel: "star-wars-build-updates"
            echo "Failed: ${err}"
            currentBuild.result = 'FAILURE'
        }




}
