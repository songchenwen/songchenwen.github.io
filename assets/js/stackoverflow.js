$(document).ready(function() {
  loadReputaion();
});

function loadReputaion(){
  var $repu = $('.reputation');
  if($repu.length > 0){
  	var id = $repu.data('id');
  	$.get('https://api.stackexchange.com/2.2/users/' + id + '?site=stackoverflow', function(data){
  		if(data && data.items){
  			$repu.html(data.items[0].reputation);
  		}
  	});
  }
}
