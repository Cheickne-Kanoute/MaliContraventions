from .models import Notification

def notifications_processor(request):
    if request.user.is_authenticated:
        unread_count = Notification.objects.filter(utilisateur=request.user, lue=False).count()
        return {'unread_notifications_count': unread_count}
    return {'unread_notifications_count': 0}
