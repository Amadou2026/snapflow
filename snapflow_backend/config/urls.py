from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import *
from rest_framework_simplejwt.views import  TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path


router = DefaultRouter()
router.register(r'projets', ProjetViewSet)
router.register(r'axes', AxeViewSet)
router.register(r'sous-axes', SousAxeViewSet)
router.register(r'rapports', RapportViewSet)
router.register(r'logs', ExecutionLogViewSet)
router.register(r'tests', TestAutomatiqueViewSet)  # <-- Ajout ici
router.register(r'users', UserViewSet) 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # Auth JWT
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Redmine
    path('api/tickets/', get_redmine_tickets, name='redmine-tickets'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
