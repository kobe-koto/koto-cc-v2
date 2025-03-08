function CheckDeployment () {
    var GitHubAPI = new XMLHttpRequest();
    GitHubAPI.open("GET", "https://api.github.com/repos/kobe-koto/koto-cc-v2/deployments", true);
    GitHubAPI.onload = function () {
        CheckDeploymentStatus(JSON.parse(this.response)[0]);
    }
    GitHubAPI.send();
}

function CheckDeploymentStatus (Deployment) {
    var GitHubStatus = new XMLHttpRequest();
    GitHubStatus.open("GET",
        "https://proxy.cors.sh/https://github.com/kobe-koto/koto-cc-v2/full_associated_pulls/" + Deployment.id,
        true);
    GitHubStatus.onload = function () {
        // noinspection JSPotentiallyInvalidUsageOfThis
        var Status =
            this.response.match(/Deployment Status Label: Active/)
                ? "Active" : this.response.match(/Deployment Status Label: In progress/)
                ? "InProgress" : this.response.match(/Deployment Status Label: Inactive/)
                ? "InActive" : "Unknown";
        document
            .getElementsByClassName("center")[0]
            .getElementsByTagName("h3")[0]
            .innerHTML =
            (
                Status === "Active"
                    ? "此次部署已完成, 狀態檢查稍有延時. 若在倉庫內發現文件存在, 請加以 Hard Reload." : Status === "InProgress"
                    ? "正在部署. 若在倉庫內發現文件存在, 请等待 GitHub Action 部署完成后加以 Hard Reload." : Status==="InActive"
                    ? "部署失敗或失效." : "檢查失敗."
            ) +
            "<br/><br/>Latest Deployment (" + Deployment.sha.slice(0, 7) + ") " +
            (
                Status === "Active"
                    ? "<i class=\"fa-solid fa-circle-check\"></i> " : Status === "InProgress"
                    ? "<i class=\"fa-solid fa-hourglass-half\"></i> " : Status==="InActive"
                    ? "<i class=\"fa-solid fa-circle-exclamation\"></i> " : "<i class=\"fa-solid fa-circle-xmark\"></i> "
            ) + Status;
    }
    GitHubStatus.send();
}