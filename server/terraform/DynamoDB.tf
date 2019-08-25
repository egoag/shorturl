resource "aws_dynamodb_table" "shorturl_dynamodb_table" {
  name = "ShortUrl"
  read_capacity = 10
  write_capacity = 10
  hash_key = "urlId"
  range_key = "varies"

  attribute {
      name = "urlId"
      type = "S"
  }

  attribute {
      name = "varies"
      type = "S"
  }

  attribute {
    name = "ownerId"
    type = "S"
  }

  attribute {
    name = "updatedAt"
    type = "S"
  }

  global_secondary_index {
    name = "UserIndex"
    hash_key = "ownerId"
    range_key = "updatedAt"
    read_capacity = 5
    write_capacity = 5
    projection_type = "KEYS_ONLY"
  }
}

