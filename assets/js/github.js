$(document).ready(function() {
    loadGithubRepos();
});

function loadGithubRepos(){
  var $repoInfos = $('.repo-info');
  $repoInfos.each(function(index, repoInfo){
    var $repoInfo = $(repoInfo);
    var repo = $repoInfo.data('repo');
    var username = $repoInfo.data('username');
    $.get("https://api.github.com/repos/" + repo, function(data){
        if(data){
          if(data.stargazers_count){
            $repoStar = $repoInfo.find('.repo-star');
            $repoStar.show();
            $star = $repoStar.find('.star');
            $star.html(data.stargazers_count);
            $repoStar.find('img').height($star.height() * 0.9);
            $repoStar.find('img').width($star.height() * 0.9);
          }else{
            console.log("no repo stargazers_count of " + repo)
          }
        }else{
          console.log("no repo info of " + repo)
        }
    });
    $.get("https://api.github.com/repos/" + repo + "/contributors", function(data){
        if(data && data.length > 0){
          var total = 0;
          var mine = 0;
          $(data).each(function(index, con){
             total += con.contributions;
             if (con.login == username){
              mine = con.contributions;
             }
          });
          if(mine > 0){
            var percent = Math.round(mine * 100 / total);
            $repoContribution = $repoInfo.find('.repo-contribution');
            $repoContribution.show();
            $contribution = $repoContribution.find('.contribution');
            $contribution.html("" + percent + "% among " + data.length + " contributors");
          }else{
            console.log("I don't contribute to " + repo);
          }
        }else{
          console.log("no contributor info of " + repo)
        }
    });
  });
}