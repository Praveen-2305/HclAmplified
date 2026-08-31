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
        competencies = json.loads(cert.verified_competencies_json)
    except Exception:
        competencies = []

    return CertificateDataSchema(
        id=cert.id,
        certificateNumber=cert.certificate_number,
        recipientName=cert.recipient_name,
        recipientTitle=cert.recipient_title,
        pathTitle=cert.path_title,
        completionDate=cert.completion_date,
        grade=cert.grade,
        verifiedCompetencies=competencies,
        issuer=cert.issuer,
        verificationHash=cert.verification_hash,
        honorsDistinction=cert.honors_distinction,
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
        competencies = json.loads(cert.verified_competencies_json)
    except Exception:
        competencies = []

    cert_data = CertificateDataSchema(
        id=cert.id,
        certificateNumber=cert.certificate_number,
        recipientName=cert.recipient_name,
        recipientTitle=cert.recipient_title,
        pathTitle=cert.path_title,
        completionDate=cert.completion_date,
        grade=cert.grade,
        verifiedCompetencies=competencies,
        issuer=cert.issuer,
        verificationHash=cert.verification_hash,
        honorsDistinction=cert.honors_distinction,
    )

    return CertificateVerificationResponse(
        isValid=True,
        certificate=cert_data,
    )
