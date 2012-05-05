	var map;
	var last_infowindow;
	var last_marker;
	var markers = [];
	
	function createMarker(data) {

		var html = "<img src='"+data.image+"'/>";
		
		if(data.image.indexOf('_end') != -1)
			html += " <b>Received At</b> ("+data.ip+")";
		else if(data.image.indexOf('_start') != -1)
			html += " <b>Sent From</b> ("+data.ip+")";
		else
			html += " <b>Hop #"+data.hopnum+"</b> ("+data.ip+")";
		if(data.lat){
			var marker = new google.maps.Marker({
		  		position: new google.maps.LatLng(data.lat, data.lng),
				map:map,
				draggable:false,
				animation: google.maps.Animation.DROP,
				icon: data.image
			});
			if(data.countryName != '' && data.countryCode != '')
				html += "<br/>" + data.countryName + " ("+data.countryCode+") ";
			else if(data.countryName != '')
				html += "<br/>" + data.countryName;
			else if(data.countryCode != '')
				html += "<br/>" + data.countryCode;
			if(data.flag)
				html += "<img src='"+data.flag+"'/>";
				
			if(data.state != '' && data.city != '')
				html += "<br/>" + data.city+", "+data.state;
			else if(data.state != '')
				html += "<br/>" + data.state;	
			else if(data.city != '')
				html += "<br/>" + data.city;	
			
			if(data.host)
				html += "<br/>Received By:<i> " + data.host + "</i>";			
			if(showWeather && data.weather){
				var wimage = data.weather.image.split('/');
				if((wimage[5].indexOf('clear') != -1 || wimage[5].indexOf('sun') != -1) && !isDay())
					data.weather.image = data.weather.image.replace(wimage[5],'clear_night.png');
				else if(wimage[5].indexOf('cloudy') != -1 && !isDay())
					data.weather.image = data.weather.image.replace(wimage[5],'cloudy_night.png');
						
				if(!$('#milage') || $('#milage').data('unit')=='mi')
					html += '<br/>Weather: <img src="'+data.weather.image+'"/> '+data.weather.cond+' '+data.weather.temp.F+'&deg;F';	
				else
					html += '<br/>Weather: <img src="'+data.weather.image+'"/> '+data.weather.cond+' '+data.weather.temp.C+'&deg;C';	
			}
			
			var infowindow = new google.maps.InfoWindow({content: '<div class="pop">'+html+'</div>'});
		
			google.maps.event.addListener(marker, "mouseover", function() {
		    
				//bounce
				if(last_marker && last_marker.getAnimation() != null)
					last_marker.setAnimation(null);
				//set market animation
				marker.setAnimation(google.maps.Animation.BOUNCE);
				//set last marker
				last_marker=marker;
				//show info
				infowindow.open(map,marker);
				
				if(last_infowindow)
					last_infowindow.close();
				
				last_infowindow = infowindow;	
				
		  	});
		  	markers[data.hopnum]=marker;
		}
		
	  	//add marker to sidebar
	  	if($('#route').length){
	  		if(data.lat)
			  	$('#route ul').append('<li onclick="ShowWin('+data.hopnum+')">'+html+'</li>');
			 else
			 	$('#route ul').append('<li>'+html+'</li>');
		  }
	  
	}
	
	function ShowWin(hopnum)
	{
		google.maps.event.trigger(markers[hopnum],'mouseover'); 
	}
	
	function addCommas(nStr)
	{
		nStr += '';
		var x = nStr.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}

	function initMap(data) {
	    var centered = false;
	    var myOptions = {
	      zoom: 4,
	      center: new google.maps.LatLng(0, -180),
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	
	    map = new google.maps.Map(document.getElementById("map"), myOptions);
		var emailCoordinates = [];
		 
		if(data.meta.code==200){	
			$(data.response.route).each(function(){
				createMarker(this);
				if(this.lat){
					emailCoordinates.push(new google.maps.LatLng(this.lat, this.lng));	
					//center on first point
					if(!centered){
						centered=true;
						map.setCenter(new google.maps.LatLng(this.lat, this.lng));
					}
				}
			});
			
			if(emailCoordinates.length>0){
			    var mailPath = new google.maps.Polyline({
			      path: emailCoordinates,
			      strokeColor: "#FF0000",
			      strokeOpacity: 1.0,
			      strokeWeight: 2
			    });
			}
			if($('#milage') && $('#milage').data('unit')=='mi')
				$('#milage').html('This message traveled '+addCommas(Math.round(data.response.distance.miles))+' miles');
			else
				$('#milage').html('This message traveled '+addCommas(Math.round(data.response.distance.kilometers))+' kilometers');
		}
		
	   mailPath.setMap(map);
  }
  
  function isDay(){
	var d = new Date();
	if(d.getHours()>7 && d.getHours()<19)
		return true;
	else
		return false;
	}