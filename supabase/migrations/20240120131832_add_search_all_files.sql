CREATE OR REPLACE FUNCTION match_file_items_local_all (
  query_embedding vector(384),
  match_count int DEFAULT null
) RETURNS TABLE (
  id UUID,
  file_id UUID,
  content TEXT,
  tokens INT,
  similarity float,
  file_name TEXT,
  file_type TEXT,
  file_description TEXT,
  file_path TEXT,
  file_size INT,
  file_tokens INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    fi.id,
    fi.file_id,
    fi.content,
    fi.tokens,
    1 - (fi.local_embedding <=> query_embedding) AS similarity,
    f.name,
    f.type,
    f.description,
    f.file_path,
    f.size,
    f.tokens
  FROM file_items fi
  JOIN files f ON fi.file_id = f.id
  ORDER BY fi.local_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

CREATE OR REPLACE FUNCTION match_file_items_openai_all (
  query_embedding vector(1536),
  match_count int DEFAULT null
) RETURNS TABLE (
  id UUID,
  file_id UUID,
  content TEXT,
  tokens INT,
  similarity float,
  file_name TEXT,
  file_type TEXT,
  file_description TEXT,
  file_path TEXT,
  file_size INT,
  file_tokens INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    fi.id,
    fi.file_id,
    fi.content,
    fi.tokens,
    1 - (fi.openai_embedding <=> query_embedding) AS similarity,
    f.name,
    f.type,
    f.description,
    f.file_path,
    f.size,
    f.tokens
  FROM file_items fi
  JOIN files f ON fi.file_id = f.id
  ORDER BY fi.openai_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;