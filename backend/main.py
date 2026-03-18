import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from db import lifespan
from routes.academics.attendance import router as attendance_router
from routes.academics.exams import router as exams_router
from routes.academics.facility import router as facility_router
from routes.academics.placement import router as placement_router
from routes.academics.timetable import router as timetable_router
from routes.analytics import router as analytics_router
from routes.notifications import router as notifications_router
from routes.payroll import router as payroll_router
from routes.staff import router as staff_router
from routes.students import router as students_router

PORT = int(os.getenv("PORT", 5000))

app = FastAPI(title="CMS API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Serve Vite Frontend
# -------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = BASE_DIR / "dist"
DIST_ASSETS_DIR = DIST_DIR / "assets"
DIST_INDEX_FILE = DIST_DIR / "index.html"

if DIST_ASSETS_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(DIST_ASSETS_DIR)), name="assets")


@app.get("/")
async def serve_frontend():
    if DIST_INDEX_FILE.exists():
        return FileResponse(str(DIST_INDEX_FILE))
    return {
        "message": "Frontend build not found. Run `npm run build` to serve static UI from FastAPI, or run Vite dev server for frontend development."
    }

app.include_router(staff_router)
app.include_router(payroll_router)
app.include_router(analytics_router)
app.include_router(exams_router)
app.include_router(timetable_router)
app.include_router(attendance_router)
app.include_router(placement_router)
app.include_router(facility_router)
app.include_router(notifications_router)
app.include_router(students_router)


@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    if full_path.startswith("api") or full_path.startswith("docs"):
        raise HTTPException(status_code=404)
    if DIST_INDEX_FILE.exists():
        return FileResponse(str(DIST_INDEX_FILE))
    raise HTTPException(status_code=404, detail="Frontend build not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=5000)
