#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function
import json
import os
import sys

try:
    # py3
    from urllib.request import urlopen, Request
except ImportError:
    # py2 fallback
    from urllib2 import urlopen, Request

# Đích mặc định: ES 2.4.1 index/type như README của MedQA
ELASTIC_SEARCH_URL = os.getenv(
    "ES_BULK_URL",
    "http://localhost:9200/knowledge/sentence/_bulk"
)

# Số doc mỗi lần POST (mỗi dòng = 1 doc)
DOCUMENTS_PER_POST = 10000

def docs_to_ndjson(lines):
    """
    Biến các dòng văn bản (đã token hóa TV) thành NDJSON cho _bulk:
      { "index": {} }
      { "body": "<nội dung dòng>" }
    """
    buf = []
    for line in lines:
        text = line.strip()
        if not text:
            continue
        buf.append(json.dumps({"index": {}}, ensure_ascii=False))
        buf.append(json.dumps({"body": text}, ensure_ascii=False))
    # NDJSON cần newline ở giữa các record và newline ở cuối
    return ("\n".join(buf) + "\n").encode("utf-8")

def groups(it, size):
    batch = []
    for x in it:
        batch.append(x)
        if len(batch) == size:
            yield batch
            batch = []
    if batch:
        yield batch

def bulk_post(ndjson_bytes, url):
    req = Request(url, data=ndjson_bytes)
    # Chuẩn cho _bulk
    req.add_header("Content-Type", "application/x-ndjson; charset=utf-8")
    resp = urlopen(req)
    out = resp.read().decode("utf-8", errors="ignore")
    try:
        j = json.loads(out)
        print("Posted {} docs. errors = {}".format(
            j.get("items") and len(j["items"]) or 0,
            j.get("errors", "?")
        ))
    except Exception:
        # ES 2.x vẫn trả JSON; nếu khác thường thì in raw để debug
        print(out)

def main():
    total = 0
    # KHÔNG còn lọc ký tự, KHÔNG tách câu theo dấu chấm.
    # Mỗi DÒNG stdin = 1 DOCUMENT.
    stdin = (ln for ln in sys.stdin)

    for batch in groups(stdin, DOCUMENTS_PER_POST):
        payload = docs_to_ndjson(batch)
        bulk_post(payload, ELASTIC_SEARCH_URL)
        total += len(batch)

    print("Documents posted:", total)

if __name__ == "__main__":
    main()
