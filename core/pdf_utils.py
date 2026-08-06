from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import io
from .utils import generer_qrcode

def generer_pdf_contravention(contravention, request):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # En-tête
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, height - 50, "REPUBLIQUE DU MALI")
    p.setFont("Helvetica", 12)
    p.drawString(100, height - 70, "Ministère de la Sécurité et de la Protection Civile")
    p.drawString(100, height - 90, "Direction Nationale de la Police")

    # Titre
    p.setFont("Helvetica-Bold", 14)
    p.drawString(100, height - 130, f"AVIS DE CONTRAVENTION N° {contravention.numero}")

    # Informations
    p.setFont("Helvetica", 12)
    y = height - 170
    p.drawString(100, y, f"Date: {contravention.date_contravention.strftime('%d/%m/%Y %H:%M')}")
    p.drawString(100, y - 20, f"Lieu: {contravention.lieu_adresse} ({contravention.commune})")
    
    p.drawString(100, y - 60, f"Infraction: {contravention.infraction.libelle}")
    p.drawString(100, y - 80, f"Véhicule: {contravention.immatriculation_vehicule} ({contravention.get_type_vehicule_display()})")
    
    p.drawString(100, y - 120, f"Contrevenant: {contravention.nom_citoyen_affiche}")
    
    p.setFont("Helvetica-Bold", 12)
    p.drawString(100, y - 160, f"Montant de l'amende: {contravention.montant} FCFA")
    p.drawString(100, y - 180, f"Statut: {contravention.get_statut_display()}")

    # QR Code
    qr_url = contravention.get_qr_data(request)
    qr_buffer = generer_qrcode(qr_url)
    qr_image = ImageReader(qr_buffer)
    
    p.drawImage(qr_image, 100, y - 350, width=150, height=150)
    p.setFont("Helvetica", 10)
    p.drawString(100, y - 370, "Scannez pour vérifier l'authenticité de cette contravention.")

    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer
