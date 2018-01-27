function showNotification(icon,title, body) {
    window.Notification.requestPermission().then(function (notificationPermissionResult){
        if(notificationPermissionResult == 'granted'){
            new window.Notification(title,{
                icon: icon,
                body: body
            });
        }
    })
}