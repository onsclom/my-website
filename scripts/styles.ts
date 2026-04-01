export const STYLES = `
body {
  margin-right: 2ch;
  margin-bottom: 2lh;
}

@media (min-width: 600px) {
  body {
    margin-right: 4ch;
  }
}

.post-header {
  margin-bottom: 1lh;
}

.post-header h1::before {
  content: "# ";
}

.post-date {
  opacity: 0.6;
  display: block;
  margin-top: 0.5lh;
}

.post-content {
  max-width: 70ch;
}

.post-content p,
.post-content li {
  line-height: 1.6;
}

.post-content h1::before { content: "# "; }
.post-content h2::before { content: "## "; }
.post-content h3::before { content: "### "; }

.post-content h1,
.post-content h2,
.post-content h3 {
  margin-top: 1.5lh;
  margin-bottom: 0.5lh;
}

.post-content p {
  margin-bottom: 1lh;
}

.post-content ul,
.post-content ol {
  margin-bottom: 1lh;
  padding-left: 3ch;
}

.post-content li {
  margin-bottom: 0.25lh;
}

.post-content pre {
  margin-bottom: 1lh;
  padding: 1ch;
  overflow-x: auto;
  border: 1px solid var(--color-text);
  line-height: 1.4;
  background: rgba(128, 128, 128, 0.1);
}

.post-content code {
  font-size: 0.9rem;
}

.post-content :not(pre) > code {
  padding: 0.2em 0.4em;
  background: rgba(128, 128, 128, 0.15);
  border-radius: 3px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.post-content img {
  max-width: 100%;
  margin-bottom: 1lh;
}

.post-content blockquote {
  border-left: 3px solid var(--color-text);
  padding-left: 2ch;
  margin-bottom: 1lh;
  opacity: 0.8;
}

.back-link {
  display: inline-block;
  margin-bottom: 1lh;
}

/* posts listing */
.posts-list {
  list-style: none;
  padding: 0;
}

.posts-list li {
  margin-bottom: 1lh;
}

.posts-list .post-title {
  display: block;
}

.posts-list .post-date {
  opacity: 0.6;
  margin-top: 0.25lh;
}
`;
