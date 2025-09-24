package main

import (
	"applab/api/backend/internal/infra"
	"applab/api/backend/internal/web"
	"context"
	"log"
	"net/http"
	"time"

	"github.com/joho/godotenv"
)

func main(){
	
	// Flow is Request → Router → Middleware → Handler → DB → Response
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10 * time.Second)
	defer cancel()

	// init mongo
	db, col := infra.InitMgo(ctx)

	// init app config
	port := infra.MustEnv("API_PORT", "8080")

	// build router
	router := web.NewRouter(db, col)

	log.Printf("API listening on :%s", port)

	// ListenAndServe listens on the TCP network address addr and then calls
	// [Serve] with handler to handle requests on incoming connections.
	// Accepted connections are configured to enable TCP keep-alives.
	//
	// The handler is typically nil, in which case [DefaultServeMux] is used.
	//
	// ListenAndServe always returns a non-nil error.
	log.Fatal(http.ListenAndServe(":"+port, router))
}
