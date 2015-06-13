$(document).ready(function() {
  loadGithubRepos();
  loadLanguages();
});

function loadLanguages(){
  var $repoInfos = $('.repo-info');
  var $languages = $('#languages');
  var gotCount = 0;
  if($languages.length > 0 && $repoInfos.length > 0){
    $repoInfos.each(function(index, repoInfo){
      var $repoInfo = $(repoInfo);
      var repo = $repoInfo.data('repo');
      $.get("https://api.github.com/repos/" + repo + "/languages", function(data){
        if(data){
          for(var l in data){
            var $l = $languages.find('#' + l + ' .byte');
            if($l.length > 0){
              $l.html(parseInt($l.html()) + data[l]);
            }
          }
        }
      }).always(function(){
        gotCount++;
        if(gotCount >= $repoInfos.length){
          $languages.find('.loading').hide();
        }
      });
    });
  }
}

function loadGithubRepos(){
  var $repoInfos = $('.repo-info');
  var $totalStar = $('.star-total');
  var totalStar = 0;
  $repoInfos.each(function(index, repoInfo){
    var $repoInfo = $(repoInfo);
    var repo = $repoInfo.data('repo');
    var username = $repoInfo.data('username');
    var star = 0;
    var percent = 0;
    $.get("https://api.github.com/repos/" + repo, function(data){
        if(data){
          if(data.stargazers_count){
            $repoStar = $repoInfo.find('.repo-star');
            star = data.stargazers_count;
            totalStar += star;
            updateTotalStar($totalStar, totalStar);
            if($repoStar){
              $repoStar.show();
              $star = $repoStar.find('.star');
              $star.html(data.stargazers_count);
              $repoStar.find('img').height($star.height() * 0.9);
              $repoStar.find('img').width($star.height() * 0.9);
            }
          }else{
            console.log("no repo stargazers_count of " + repo)
          }
        }else{
          console.log("no repo info of " + repo)
        }
    });
    if($repoInfo.find('.repo-contribution').length > 0){   
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
              percent = Math.round(mine * 100 / total);
              $repoContribution = $repoInfo.find('.repo-contribution');
              if($repoContribution){  
                $repoContribution.show();
                $contribution = $repoContribution.find('.contribution');
                $contribution.html("" + percent + "% among " + data.length + " contributors");
              }
            }else{
              console.log("I don't contribute to " + repo);
            }
          }else{
            console.log("no contributor info of " + repo)
          }
      });
    }
  });
}

function updateTotalStar(item, star){
  if(item){
    item.html("" + star);
  }
}
