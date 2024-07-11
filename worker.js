// worker.js

importScripts("./jsrsasign/jsrsasign-all-min.js")

const generateJWT = function(appID, privateKey){
    // Header
    var header = JSON.stringify({
        alg: 'RS256',
        typ: 'JWT'
    });
    
    // Payload
    var payload = JSON.stringify({
        iat: KJUR.jws.IntDate.get('now'),
        exp: KJUR.jws.IntDate.get('now') + (60 * 10), // +10 minutes.
        iss: appID
    });

    // Private key
    var key = KEYUTIL.getKey(privateKey);

    return KJUR.jws.JWS.sign("RS256", header, payload, key);
}

// This key can be publically exposed as the corresponding GitHub app only has restricted permissions to execute existing workflows.
var JWT = generateJWT("914621", "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDQBwlReaQIkzJf\nSna2JuzM6qOV+TRM4/evoRnkv8ffGo33ssbVDH8CWIaIofiP6Z7X26qOjex3xuHu\n8APv9CO/RnAS71Dfmka8qvpT1AdiVhWPYqGQ+YcXrwgORXy+NHnW2fvP/lctBrkp\n1CU6gWr5ATHm2ZxLOXF+R/cgWbGm7Q39/eoVUx7+xUxq/lWm3D73I2n6XSfKo1Ga\ne1ARPEXno2R3PLClUnfXpUB/G09sxCqjipAT+pVfQlWNtON81r8fUn1V2ZEqEqpZ\ngTyE9q/tJNESEiiiOnqG0Odt6OY3qxtTaS2rEcygngaPpODXL9rOrnGwYmRgIjLb\n09PSNs59AgMBAAECggEBAMm1KOnhYpYV9A/Fqhmw4IdJNFklC/tKSE35jZvqASlp\nHCMDLBxEQ5rIr5ooQ1V3l1eCXXxgTNtO8p+2BntSZJ8A84bImchWVSR3PMavnoFR\nKxKe9j4WVVE3nD4KTow3YbRcJPhmi6zTChNu6rIx7sGG0RYgBpZCGrPxn8O0dLd+\n/9WKiQrH0TMkp+EnCFCeHcNz0lUwvKo1slb6s88/tQYr00iP/yZ5CtYZniln2G2A\n14oMuLOfPWNq+ynwJX1Iuneg6PhnIqfSBDUo24k0xaaqfUBcDojCGB1bGIIRGV2E\nDzsddI3GGVC1WbWL1hPqHFcucvc1g9SJ15P3tgD6qZkCgYEA8M/bnUca9i+QfiM6\nVifQgdFz4XcByp0mfMRVAvxkID11e/wivoIs/MpaPo9y8QHXscD4A18ys+mYG78P\nzScdmeRAI8CzZ66853lx18gCT1OdFqPGWTnlMFVQpFqKuh5yj1bCi8/eklS18Ynv\npZuEPeFX73zp2uNmNplalE03zVMCgYEA3SXXeIrj7AOosA8IESiyEbmTkVb1KNe3\nvjvFM3353X9P1Lkg0+vLAGjL2TYPo1dZB7XtPOovEIsBwaObODONTKUZKfOUGQBE\nbiAWB6EdqrQiZMvFHXhVB0n5SgIYS3qJm1rw54miiG56Jgsfye0i8k225VBB0yVC\nVHZM1EKHqu8CgYEAizti+viVuimeHZA4tn+mqqhzm7S3MHLUQecyT9ul+I4QU3Ng\nk02ovTAyJWHDT12FXJz5yNlN83/oFoLNnAw1rTivbPyJvjTlu+AX1m8qBruNY/2l\nPQmgXeW2DpDbDOl1yzKaoUO6qFiaKeFa0iGswCp+MVXD0G8SNhdMq9pJnUkCgYBJ\nqOIVN4XlRe64/bi9JmXxe3OIlINCIGAGUBhGJ27DdTVc8HDbxY0vTLihV91rlZuE\n8vbbNFGK3BIwslLwLFOjNNal34jzruAcIjnUPrkH88oE8s5sG3mO3PfYy8vV0DHn\neioFpRVrBglPhKMI+iCKvpHt3YafUqi+Q00h4isYJwKBgFyM9LAdSJufZkDkowFh\njphfU8MxOOJq6SkVdUXJrR+9AmiocjoY29/CVAh2wzpkZ+Em04jGLHcp7o3Kl+RE\nm17B+a4qdR+vVB4wI4qbDzzKDcotYUDYtjtzyms8Z9fKLxQtoZ4OKLjEwpM/20dB\nqvUBOmpsKVcSTAxPsi1h0D7m\n-----END PRIVATE KEY-----\n");

const getToken = async function(installationID, JWT){
    var tokenRequest = await fetch(`https://api.github.com/app/installations/${installationID}/access_tokens`, {
        method: "post",
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${JWT}`,
            "X-GitHub-Api-Version": "2022-11-28"
        }
    }).then(function(response){
        return response.json();
    });
    return tokenRequest.token;
}

const runWorkflows = async function(token, userID, resource){
    var owner = "story-narrator";
    var repo = "story-narrator-helper";

    // Execute 'All' workflow.
    var workflow_id = encodeURIComponent("All.yml");

    await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`, {
        method: "post",
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `token ${token}`,
            "X-GitHub-Api-Version": "2022-11-28"
        },
        body: JSON.stringify({
            "ref": "main",
            "inputs": {
                "userID": userID,
                "resource": resource
            }
        })
    });

    /*
    // Execute 'Retrieve Content' workflow.
    var workflow_id = encodeURIComponent("Retrieve Content.yml");

    await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`, {
        method: "post",
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `token ${token}`,
            "X-GitHub-Api-Version": "2022-11-28"
        },
        body: JSON.stringify({
            "ref": "main",
            "inputs": {
                "userID": userID,
                "resource": resource
            }
        })
    });

    // Execute 'Get Output URL' workflow.
    var workflow_id = encodeURIComponent("Get Output URL.yml");

    await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`, {
        method: "post",
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `token ${token}`,
            "X-GitHub-Api-Version": "2022-11-28"
        },
        body: JSON.stringify({
            "ref": "main",
            "inputs": {
                "token": token,
                "userID": userID,
                "resource": resource
            }
        })
    });
    */
}

async function listWorkflowRuns(token){
    var owner = "story-narrator";
    var repo = "story-narrator-helper";

    var runsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs?status=completed`, {
        method: "get",
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `token ${token}`,
            "X-GitHub-Api-Version": "2022-11-28"
        }
    }).then(function(response){
        return response.json();
    });

    return runsResponse;
}

const getOutputURL = async function(token, userID, resource) {
    var owner = "story-narrator";
    var repo = "story-narrator-helper";
    var runsResponse = await listWorkflowRuns(token);
    var run_id;
    var runResource;
    var runUserID;

    console.log("Number of completed runs found: ", runsResponse.workflow_runs.length);
    for (var i = 0; i < runsResponse.workflow_runs.length; i++) { 
        runResource = runsResponse.workflow_runs[i].name.replace(/^Retrieve '(.*)',.*$/, "$1");
        runUserID = runsResponse.workflow_runs[i].name.replace(/^.*, requested by (.*)\.$/, "$1");
        
        if (runResource == resource && runUserID == userID){
            run_id = runsResponse.workflow_runs[i].id;
            // Lists the workflow run's jobs:
            var jobsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs/${run_id}/jobs`, {
                method: "get",
                headers: {
                    "Accept": "application/vnd.github+json",
                    "Authorization": `token ${token}`,
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            }).then(function(response){
                return response.json();
            });

            var log = await fetch(jobsResponse.jobs[0].steps[9].name, {
                method: "get",
            }).then(function(response){
                return response.json();
            }).then(function(data){
                console.log(data);
                return data;
            });

            return log;
        }
    };
    return null;
}

function sleep(ms) {
    return new Promise(function(resolve){
        setTimeout(resolve, ms);
    });
}

self.onmessage = async function(e){
    var userID = JSON.parse(e.data).userID;
    var resource = JSON.parse(e.data).resource;
    var token = await getToken("51590067", JWT);

    await runWorkflows(token, userID, resource);

    for (let i = 0; i < 90; i++) {
        var workflowURL = await getOutputURL(token, userID, resource);
        await sleep(1000);

        if (workflowURL != null){
            self.postMessage(workflowURL);
            break;
        }
      }
}