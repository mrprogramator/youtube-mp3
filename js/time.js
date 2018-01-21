function getTimeText(dateText){
    var timeText = "";
    var fromDate = new Date(dateText).getTime();
    var nowDate = new Date().getTime();
    var diffDate = nowDate - fromDate;
    var secs = Math.round(diffDate/1000);
    var deviceLanguage = navigator.language;

    if(secs < 60){
        if(deviceLanguage.indexOf('es') >= 0)
            timeText ="Hace " + secs + (secs === 1? " segundo": " segundos");
        else
            timeText = secs + (secs === 1? " second ago": " seconds ago");
    }
    else{
        var mins = Math.round(secs/60);
        
        if(mins < 60){
            if(deviceLanguage.indexOf('es') >= 0)
                timeText = "Hace " + mins + (mins === 1? " minuto": " minutos");
            else
                timeText = mins + (mins === 1? " minute ago": " minutes ago");
        }
        else{
            var hours = Math.round(mins/60);

            if(hours < 60){
                if(deviceLanguage.indexOf('es') >= 0)
                    timeText = "Hace " + hours + (hours === 1? " hora": " horas");
                else
                    timeText = hours + (hours === 1? " hour ago": " hours ago");
            }
            else{
                var days = Math.round(hours/24);

                if(days < 30){
                    if(deviceLanguage.indexOf('es') >= 0)
                        timeText = "Hace " + days + (days === 1? " d&iacute;a": " d&iacute;as");
                    else
                        timeText = days + (days === 1? " day ago": " days ago");
                }
                else{
                    var months = Math.round(days/30);

                    if(months < 12){
                        if(deviceLanguage.indexOf('es') >= 0)
                            timeText = "Hace " + months + (months === 1? " mes": " meses");
                        else
                            timeText = months + (months === 1? " month ago": " months ago");
                    }
                    else{
                        var years = Math.round(months/12);
                        
                        if(years < 100){
                            if(deviceLanguage.indexOf('es') >= 0)
                                timeText = "Hace " + years + (years === 1? " a&ntilde;o": " a&ntilde;os");
                            else
                                timeText = years + (years === 1? " year ago": " years ago");
                        }
                        else{
                            var centuries = Math.round(years/100);
        
                            if(deviceLanguage.indexOf('es') >= 0)
                                timeText = "Hace " + centuries + (centuries === 1? " siglo": " siglos");
                            else                            
                                timeText = centuries + (centuries === 1? " century ago": " centuries ago");
                        }
                    }
                }
            }
        }
    }

    return timeText;
}