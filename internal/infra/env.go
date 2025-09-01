package infra

import (
	"log"
	"os"
)

func MustEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	if fallback != "" {
		return fallback
	}
	log.Fatalf("missing env %s", key)
	return ""
}
