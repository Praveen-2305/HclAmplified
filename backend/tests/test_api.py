import pytest
from fastapi.testclient import TestClient
from backend.main import app

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_root_and_health(client):
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["status"] == "online"

    r_health = client.get("/health")
    assert r_health.status_code == 200
    assert r_health.json()["status"] == "healthy"

def test_profile_endpoints(client):
    # Get me
    r = client.get("/api/v1/profile/me")
    assert r.status_code == 200
    data = r.json()
    assert data["name"] == "Eleanor Vance"
    assert data["persona"] in ["digger", "surface", "motivation"]

    # Patch profile
    r_patch = client.patch("/api/v1/profile/me", json={"weeklyGoalHours": 14.5, "persona": "digger"})
    assert r_patch.status_code == 200
    assert r_patch.json()["weeklyGoalHours"] == 14.5

    # Onboarding chat
    r_chat = client.post("/api/v1/profile/onboarding/chat", json={
        "userMessage": "I want to transition into deep learning over the next 18 months",
        "turnCount": 0
    })
    assert r_chat.status_code == 200
    assert "reply" in r_chat.json()

def test_roles_recommendations(client):
    r = client.get("/api/v1/roles/recommendations")
    assert r.status_code == 200
    roles = r.json()
    assert len(roles) >= 3
    assert roles[0]["matchPercentage"] >= 80

    # Custom match
    r_custom = client.post("/api/v1/roles/custom-match", json={
        "customTitle": "Robotics AI Engineer",
        "backgroundDescription": "Control theory and Python"
    })
    assert r_custom.status_code == 200
    assert "Robotics AI Engineer" in r_custom.json()["title"]

def test_roadmap_endpoints(client):
    # Current roadmap
    r = client.get("/api/v1/roadmaps/current?mode=digger")
    assert r.status_code == 200
    roadmap = r.json()
    assert len(roadmap["milestones"]) >= 4

    # Toggle module
    first_mod_id = roadmap["milestones"][0]["modules"][0]["id"]
    r_toggle = client.patch(f"/api/v1/roadmaps/modules/{first_mod_id}/toggle")
    assert r_toggle.status_code == 200
    assert "completed" in r_toggle.json()

    # Approve roadmap
    r_app = client.post("/api/v1/roadmaps/approve")
    assert r_app.status_code == 200
    assert r_app.json()["success"] is True

def test_assessment_endpoints(client):
    # Questions
    r = client.get("/api/v1/assessments/questions?topic=Deep%20Learning%20Fundamentals")
    assert r.status_code == 200
    questions = r.json()
    assert len(questions) == 5
    assert questions[0]["id"] == "q-01"

    # Submit assessment
    answers = {
        "q-01": "opt-3",
        "q-02": "opt-2",
        "q-03": "opt-1",
        "q-04": "opt-1",
        "q-05": "opt-1",
    }
    r_sub = client.post("/api/v1/assessments/submit", json={
        "topic": "Deep Learning Fundamentals",
        "answers": answers,
        "timeSpentSeconds": 210
    })
    assert r_sub.status_code == 200
    res = r_sub.json()
    assert res["scorePercentage"] == 100
    assert res["passed"] is True
    assert res["awardedPoints"] == 250

    # Weak points
    r_wp = client.get("/api/v1/assessments/weak-points")
    assert r_wp.status_code == 200

    # Partner labs
    r_labs = client.get("/api/v1/assessments/partner-labs")
    assert r_labs.status_code == 200
    labs = r_labs.json()
    assert len(labs) >= 2

def test_ai_guide(client):
    r = client.post("/api/v1/ai-guide/chat", json={
        "prompt": "Explain why SwiGLU or GELU is used over ReLU",
        "topic": "Deep Learning Fundamentals",
        "mode": "digger"
    })
    assert r.status_code == 200
    data = r.json()
    assert "reply" in data
    assert len(data["citations"]) > 0

def test_community_endpoints(client):
    # Get posts
    r = client.get("/api/v1/community/posts")
    assert r.status_code == 200
    posts = r.json()
    assert len(posts) >= 1

    # Upvote post
    post_id = posts[0]["id"]
    r_up = client.post(f"/api/v1/community/posts/{post_id}/upvote")
    assert r_up.status_code == 200

    # Add answer
    r_ans = client.post(f"/api/v1/community/posts/{post_id}/answers", json={
        "content": "RMSNorm simplifies computation by removing the mean calculation."
    })
    assert r_ans.status_code == 200
    assert r_ans.json()["isAccepted"] is False

    # Study groups
    r_grp = client.get("/api/v1/community/study-groups")
    assert r_grp.status_code == 200
    assert len(r_grp.json()) >= 2

def test_gamification_endpoints(client):
    # Rewards
    r_rew = client.get("/api/v1/gamification/rewards")
    assert r_rew.status_code == 200
    rewards = r_rew.json()
    assert len(rewards) >= 4

    # Leaderboard
    r_lb = client.get("/api/v1/gamification/leaderboard")
    assert r_lb.status_code == 200
    entries = r_lb.json()
    assert len(entries) >= 5
    assert entries[0]["rank"] == 1

def test_certificate_endpoints(client):
    # Get certificate
    r = client.get("/api/v1/certificates/me")
    assert r.status_code == 200
    cert = r.json()
    assert cert["recipientName"] == "Eleanor Vance"

    # Verify hash
    hash_val = cert["verificationHash"]
    r_ver = client.get(f"/api/v1/certificates/verify/{hash_val}")
    assert r_ver.status_code == 200
    assert r_ver.json()["isValid"] is True

def test_analytics_endpoints(client):
    r = client.get("/api/v1/analytics/cohort")
    assert r.status_code == 200
    data = r.json()
    assert data["totalEnrolled"] == 24
    assert len(data["scholars"]) == 5
