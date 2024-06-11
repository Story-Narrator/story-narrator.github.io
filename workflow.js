var workflowURL;
const runWorkflow = async function(App, userID, resource) {

    const app = new App({
        appId: 914621,
        // This key can be publically exposed as the corresponding GitHub app only has restricted permissions to execute existing workflows.
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDQBwlReaQIkzJf\nSna2JuzM6qOV+TRM4/evoRnkv8ffGo33ssbVDH8CWIaIofiP6Z7X26qOjex3xuHu\n8APv9CO/RnAS71Dfmka8qvpT1AdiVhWPYqGQ+YcXrwgORXy+NHnW2fvP/lctBrkp\n1CU6gWr5ATHm2ZxLOXF+R/cgWbGm7Q39/eoVUx7+xUxq/lWm3D73I2n6XSfKo1Ga\ne1ARPEXno2R3PLClUnfXpUB/G09sxCqjipAT+pVfQlWNtON81r8fUn1V2ZEqEqpZ\ngTyE9q/tJNESEiiiOnqG0Odt6OY3qxtTaS2rEcygngaPpODXL9rOrnGwYmRgIjLb\n09PSNs59AgMBAAECggEBAMm1KOnhYpYV9A/Fqhmw4IdJNFklC/tKSE35jZvqASlp\nHCMDLBxEQ5rIr5ooQ1V3l1eCXXxgTNtO8p+2BntSZJ8A84bImchWVSR3PMavnoFR\nKxKe9j4WVVE3nD4KTow3YbRcJPhmi6zTChNu6rIx7sGG0RYgBpZCGrPxn8O0dLd+\n/9WKiQrH0TMkp+EnCFCeHcNz0lUwvKo1slb6s88/tQYr00iP/yZ5CtYZniln2G2A\n14oMuLOfPWNq+ynwJX1Iuneg6PhnIqfSBDUo24k0xaaqfUBcDojCGB1bGIIRGV2E\nDzsddI3GGVC1WbWL1hPqHFcucvc1g9SJ15P3tgD6qZkCgYEA8M/bnUca9i+QfiM6\nVifQgdFz4XcByp0mfMRVAvxkID11e/wivoIs/MpaPo9y8QHXscD4A18ys+mYG78P\nzScdmeRAI8CzZ66853lx18gCT1OdFqPGWTnlMFVQpFqKuh5yj1bCi8/eklS18Ynv\npZuEPeFX73zp2uNmNplalE03zVMCgYEA3SXXeIrj7AOosA8IESiyEbmTkVb1KNe3\nvjvFM3353X9P1Lkg0+vLAGjL2TYPo1dZB7XtPOovEIsBwaObODONTKUZKfOUGQBE\nbiAWB6EdqrQiZMvFHXhVB0n5SgIYS3qJm1rw54miiG56Jgsfye0i8k225VBB0yVC\nVHZM1EKHqu8CgYEAizti+viVuimeHZA4tn+mqqhzm7S3MHLUQecyT9ul+I4QU3Ng\nk02ovTAyJWHDT12FXJz5yNlN83/oFoLNnAw1rTivbPyJvjTlu+AX1m8qBruNY/2l\nPQmgXeW2DpDbDOl1yzKaoUO6qFiaKeFa0iGswCp+MVXD0G8SNhdMq9pJnUkCgYBJ\nqOIVN4XlRe64/bi9JmXxe3OIlINCIGAGUBhGJ27DdTVc8HDbxY0vTLihV91rlZuE\n8vbbNFGK3BIwslLwLFOjNNal34jzruAcIjnUPrkH88oE8s5sG3mO3PfYy8vV0DHn\neioFpRVrBglPhKMI+iCKvpHt3YafUqi+Q00h4isYJwKBgFyM9LAdSJufZkDkowFh\njphfU8MxOOJq6SkVdUXJrR+9AmiocjoY29/CVAh2wzpkZ+Em04jGLHcp7o3Kl+RE\nm17B+a4qdR+vVB4wI4qbDzzKDcotYUDYtjtzyms8Z9fKLxQtoZ4OKLjEwpM/20dB\nqvUBOmpsKVcSTAxPsi1h0D7m\n-----END PRIVATE KEY-----\n",
    });

    const octokit = await app.getInstallationOctokit("51590067");
    const { token } = await octokit.auth({ type: "installation" });


    // Execute 'Retrieve Content' workflow.
    await octokit.request("POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches", {
        owner: "story-narrator",
        repo: "story-narrator-helper",
        workflow_id: "Retrieve Content.yml",
        ref: 'main',
        inputs: {
            userID: userID,
            resource: resource
        },
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    // Execute 'Get Output URL' workflow.
    await octokit.request("POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches", {
        owner: "story-narrator",
        repo: "story-narrator-helper",
        workflow_id: "Get Output URL.yml",
        ref: 'main',
        inputs: {
            token: token,
            userID: userID,
            resource: resource
        },
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    try {
        var runs_response;
        var run_resource;
        var run_userID;
        var wf_found = 0;
        var jobs_response;

        async function myFunction(){
            runs_response = await octokit.request('GET /repos/{owner}/{repo}/actions/runs?status=completed', {
                owner: "story-narrator",
                repo: "story-narrator-helper",
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
        }

        async function myFunction2(){
            await myFunction();
            for (var i = 0; i < runs_response.data.workflow_runs.length; i++) { 
                run_resource = runs_response.data.workflow_runs[i].name.replace(/^URL of '(.*)',.*$/, "$1");
                run_userID = runs_response.data.workflow_runs[i].name.replace(/^.*for (.*)\.$/, "$1");
                
                if (run_resource == resource && run_userID == userID){
                    wf_found = 1;
                    
                    // Lists the workflow run's jobs:
                    jobs_response = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs', {
                        owner: "story-narrator",
                        repo: "story-narrator-helper",
                        run_id: runs_response.data.workflow_runs[i].id,
                        headers: {
                            'X-GitHub-Api-Version': '2022-11-28'
                        }
                    });

                    workflowURL = jobs_response.data.jobs[0].steps[2].name;
                    break;
                }
            }
        };

        // Function that resolves after a sleep time
        async function sleep(ms) {
            return new Promise(function(resolve){
                setTimeout(resolve, ms);
            });
        }

        // Loop until timeout.
        for (var l = 0; l < 30; l++) {
            await myFunction2();

            if (wf_found) {
                break;
            };
            // Wait 1 second before re-calling the function. Timeout after 30 seconds (30 * 1 seconds);
            await sleep(1000);
        }

        if (!wf_found){
            throw "Error: A workflow matching the specified resource and userID was not found.";
        };

    }
    catch (error) {
        console.log(error);
    }
}
  