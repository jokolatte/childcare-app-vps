from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_view(request):
    return JsonResponse({"message": "Welcome to the Childcare App!"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('', include('core.urls')),  # Include core URLs directly without an extra prefix
    path('', root_view, name='root_view'),  # Root URL response
]
