import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import Certificate
from backend.app.schemas.schemas import (
    CertificateDataSchema,
    CertificateVerificationResponse,
)

router = APIRouter(prefix="/certificates", tags=["Credentials & Certificate Verification"])

@router.get("/me", response_model=CertificateDataSchema)
def get_my_certificate(db: Session = Depends(get_db)):
    """
    Returns the verified certificate for the active learner.
    """
    cert = db.query(Certificate).first()
    if not cert:
        raise HTTPException(status_code=404, detail="No certificate found")

    try:
        competencies = json.loads(str(cert.verified_competencies_json or "[]"))
    except Exception:
        competencies = []

    return CertificateDataSchema(
        id=str(cert.id),
        certificateNumber=str(cert.certificate_number),
        recipientName=str(cert.recipient_name),
        recipientTitle=str(cert.recipient_title),
        pathTitle=str(cert.path_title),
        completionDate=str(cert.completion_date),
        grade=str(cert.grade),
        verifiedCompetencies=competencies,
        issuer=str(cert.issuer),
        verificationHash=str(cert.verification_hash),
        honorsDistinction=str(cert.honors_distinction) if cert.honors_distinction else None,
    )

@router.get("/verify/{verification_hash}", response_model=CertificateVerificationResponse)
def verify_certificate_hash(
    verification_hash: str,
    db: Session = Depends(get_db),
):
    """
    Public verification endpoint to authenticate cryptographic SHA-256 certificate hashes.
    """
    cert = db.query(Certificate).filter(Certificate.verification_hash == verification_hash).first()
    if not cert:
        return CertificateVerificationResponse(
            isValid=False,
            certificate=None,
        )

    try:
        competencies = json.loads(str(cert.verified_competencies_json or "[]"))
    except Exception:
        competencies = []

    cert_data = CertificateDataSchema(
        id=str(cert.id),
        certificateNumber=str(cert.certificate_number),
        recipientName=str(cert.recipient_name),
        recipientTitle=str(cert.recipient_title),
        pathTitle=str(cert.path_title),
        completionDate=str(cert.completion_date),
        grade=str(cert.grade),
        verifiedCompetencies=competencies,
        issuer=str(cert.issuer),
        verificationHash=str(cert.verification_hash),
        honorsDistinction=str(cert.honors_distinction) if cert.honors_distinction else None,
    )

    return CertificateVerificationResponse(
        isValid=True,
        certificate=cert_data,
    )
