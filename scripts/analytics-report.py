#!/usr/bin/env python3
"""
Wylibrary Google Analytics 4 Reporting Tool
Fetches live metrics, student locations, popular books, and engagement from GA4.
Usage:
  uv run --with google-analytics-data scripts/analytics-report.py [--days 30] [--realtime]
"""

import os
import sys
import argparse
from pathlib import Path

# Auto-locate service account credentials
KEY_PATH = Path(__file__).resolve().parent / "analytics-key.json"
if not KEY_PATH.exists():
    fallback = Path("/home/wy/Downloads/praxis-atrium-399314-d997445deba5.json")
    if fallback.exists():
        KEY_PATH = fallback
    else:
        print("Error: Could not find analytics-key.json in scripts/ or Downloads/")
        sys.exit(1)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(KEY_PATH)
os.environ["GRPC_DNS_RESOLVER"] = "native"
PROPERTY_ID = os.environ.get("GA4_PROPERTY_ID", "540974263")

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
    RunRealtimeReportRequest,
    OrderBy,
)

# Use standard HTTPS REST transport instead of gRPC to prevent c-ares DNS resolve errors on mobile networks
client = BetaAnalyticsDataClient(transport="rest")

def print_header(title):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

def run_realtime():
    print_header("REALTIME OVERVIEW (Past 30 Minutes)")
    try:
        req = RunRealtimeReportRequest(
            property=f"properties/{PROPERTY_ID}",
            dimensions=[Dimension(name="country"), Dimension(name="city")],
            metrics=[Metric(name="activeUsers")],
        )
        res = client.run_realtime_report(req)
        total_active = sum(int(r.metric_values[0].value) for r in res.rows) if res.rows else 0
        print(f"  Students active right now: {total_active}")
        if res.rows:
            print("\n  Locations:")
            for r in res.rows:
                country = r.dimension_values[0].value
                city = r.dimension_values[1].value
                users = r.metric_values[0].value
                print(f"    - {city}, {country}: {users} active student(s)")
    except Exception as e:
        print(f"  Realtime query error: {e}")

def run_summary(days):
    print_header(f"WYLIBRARY ANALYTICS SUMMARY (Past {days} Days)")

    # 1. Overview metrics
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        metrics=[
            Metric(name="activeUsers"),
            Metric(name="newUsers"),
            Metric(name="sessions"),
            Metric(name="screenPageViews"),
            Metric(name="averageSessionDuration"),
        ],
        date_ranges=[DateRange(start_date=f"{days}daysAgo", end_date="today")],
    )
    res = client.run_report(req)
    if res.rows:
        row = res.rows[0]
        users = row.metric_values[0].value
        new_users = row.metric_values[1].value
        sessions = row.metric_values[2].value
        views = row.metric_values[3].value
        dur = float(row.metric_values[4].value)
        mins, secs = divmod(int(dur), 60)
        print(f"  Total Active Students : {users}")
        print(f"  New Students          : {new_users}")
        print(f"  Total Study Sessions  : {sessions}")
        print(f"  Total Page/Book Views : {views}")
        print(f"  Average Session Time  : {mins}m {secs}s")

    # 2. Malawi Geographic Breakdown
    print("\n" + "-" * 60)
    print("  STUDENTS BY CITY / DISTRICT IN MALAWI")
    print("-" * 60)
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="country"), Dimension(name="city")],
        metrics=[Metric(name="activeUsers"), Metric(name="screenPageViews")],
        date_ranges=[DateRange(start_date=f"{days}daysAgo", end_date="today")],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="activeUsers"), desc=True)],
        limit=15,
    )
    res = client.run_report(req)
    for r in res.rows:
        country = r.dimension_values[0].value
        city = r.dimension_values[1].value
        users = r.metric_values[0].value
        views = r.metric_values[1].value
        if country == "Malawi" or country == "(not set)":
            print(f"  • {city:<25} : {users:>4} students ({views} views)")
        else:
            print(f"  • {city} ({country}){' '*(20-len(city))} : {users:>4} users")

    # 3. Key Library Events
    print("\n" + "-" * 60)
    print("  KEY ACTIONS & ENGAGEMENT")
    print("-" * 60)
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="eventName")],
        metrics=[Metric(name="eventCount")],
        date_ranges=[DateRange(start_date=f"{days}daysAgo", end_date="today")],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="eventCount"), desc=True)],
        limit=20,
    )
    res = client.run_report(req)
    friendly_names = {
        "page_view": "Page / Folder Views",
        "pdf_open": "PDF Reader Opens",
        "file_download": "Direct File Downloads",
        "offline_save": "Saved to Offline Shelf",
        "search": "Library Searches",
        "pwa_installed": "App Installed on Device",
        "pwa_install_outcome": "Install Prompts Accepted",
        "session_start": "Visits Started",
        "first_visit": "First-Time Visitors",
        "quiz_answer": "Practice Quiz Answers",
        "quiz_complete": "Practice Quiz Completed",
        "file_share": "Shared with a Friend",
        "shared_file_opened": "Shared Links Opened",
    }
    for r in res.rows:
        evt = r.dimension_values[0].value
        count = r.metric_values[0].value
        label = friendly_names.get(evt, evt)
        print(f"  • {label:<30} : {count:>6}")

    # 4. Top Pages and Books
    print("\n" + "-" * 60)
    print("  TOP PAGES & SECTIONS VISITED")
    print("-" * 60)
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="pageTitle")],
        metrics=[Metric(name="screenPageViews"), Metric(name="activeUsers")],
        date_ranges=[DateRange(start_date=f"{days}daysAgo", end_date="today")],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="screenPageViews"), desc=True)],
        limit=10,
    )
    res = client.run_report(req)
    for r in res.rows:
        title = r.dimension_values[0].value[:42]
        views = r.metric_values[0].value
        users = r.metric_values[1].value
        print(f"  • {title:<42} : {views:>5} views ({users} students)")

    # 5. Device Models & OS
    print("\n" + "-" * 60)
    print("  DEVICES & OPERATING SYSTEMS")
    print("-" * 60)
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="operatingSystem"), Dimension(name="mobileDeviceModel")],
        metrics=[Metric(name="activeUsers")],
        date_ranges=[DateRange(start_date=f"{days}daysAgo", end_date="today")],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="activeUsers"), desc=True)],
        limit=10,
    )
    res = client.run_report(req)
    for r in res.rows:
        os_name = r.dimension_values[0].value
        model = r.dimension_values[1].value
        users = r.metric_values[0].value
        print(f"  • {os_name:<10} {model:<30} : {users:>4} students")

    print("\n" + "=" * 60 + "\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch Wylibrary GA4 Analytics")
    parser.add_argument("--days", type=int, default=30, help="Days to look back (default 30)")
    parser.add_argument("--realtime", action="store_true", help="Show realtime active users")
    args = parser.parse_args()

    try:
        if args.realtime:
            run_realtime()
        run_summary(args.days)
    except Exception as e:
        print(f"\n[!] Connection Notice: Could not retrieve analytics data.")
        print(f"    Details: {e}")
        print("    Tip: Check your internet connection or mobile data and try again.")
