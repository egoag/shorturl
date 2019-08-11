resource "aws_dynamodb_table" "shorturl_dynamodb_table" {
  name = "ShortUrl"
  read_capacity = 5
  write_capacity = 5
  hash_key = "urlId"
  range_key = "varies"

  attribute = [
    {
      name = "urlId"
      type = "S"
    },
    {
      name = "varies"
      type = "S"
    }]
}

