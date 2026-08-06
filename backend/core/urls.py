from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views, api_views

router = DefaultRouter()
router.register(r'infractions', api_views.InfractionViewSet, basename='api-infraction')
router.register(r'contraventions', api_views.ContraventionViewSet, basename='api-contravention')
router.register(r'paiements', api_views.PaiementViewSet, basename='api-paiement')
router.register(r'utilisateurs', api_views.UtilisateurViewSet, basename='api-utilisateur')
router.register(r'litiges', api_views.LitigeViewSet, basename='api-litige')
router.register(r'notifications', api_views.NotificationViewSet, basename='api-notification')

urlpatterns = [
    # Application Web (Templates)
    path('', views.dashboard_view, name='dashboard'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_citoyen_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    
    path('infractions/', views.infractions_list_view, name='infractions_list'),
    path('infractions/<int:pk>/edit/', views.infraction_edit_view, name='infraction_edit'),
    path('infractions/<int:pk>/delete/', views.infraction_delete_view, name='infraction_delete'),
    path('infractions/<int:pk>/toggle/', views.infraction_toggle_view, name='infraction_toggle'),

    path('agents/', views.agents_list_view, name='agents_list'),
    path('agents/<int:pk>/edit/', views.agent_edit_view, name='agent_edit'),
    path('agents/<int:pk>/delete/', views.agent_delete_view, name='agent_delete'),
    path('agents/<int:pk>/toggle/', views.agent_toggle_view, name='agent_toggle'),

    path('registre-nina/', views.registre_nina_list_view, name='registre_nina_list'),
    path('api/recherche-nina/', views.api_recherche_nina, name='api_recherche_nina'),

    path('notifications/', views.notifications_list_view, name='notifications_list'),
    path('verifier/', views.verifier_pv_view, name='verifier_pv'),
    path('code-route/', views.code_route_view, name='code_route'),
    path('statistiques/', views.statistiques_view, name='statistiques'),
    path('statistiques/export/', views.export_contraventions_csv, name='export_contraventions_csv'),
    
    path('contraventions/creer/', views.contravention_create_view, name='contravention_create'),
    path('contraventions/<int:pk>/', views.contravention_detail_view, name='contravention_detail'),
    path('contraventions/<int:pk>/valider/', views.valider_contravention_view, name='valider_contravention'),
    path('contraventions/<int:pk>/rejeter/', views.rejeter_contravention_view, name='rejeter_contravention'),
    path('contraventions/<int:pk>/payer/', views.payer_contravention_view, name='payer_contravention'),
    path('contraventions/<int:pk>/pdf/', views.contravention_pdf_view, name='contravention_pdf'),
    path('contraventions/<int:pk>/contester/', views.contester_contravention_view, name='contester_contravention'),
    
    path('litiges/', views.litiges_list_view, name='litiges_list'),
    path('litiges/<int:pk>/traiter/', views.traiter_litige_view, name='traiter_litige'),
    
    path('api/geoloc/', views.api_contraventions_geoloc, name='api_contraventions_geoloc'),

    # API REST Framework & JWT Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
]
