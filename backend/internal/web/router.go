package web

import (
	"applab/api/backend/internal/handlers"
	"applab/api/backend/internal/infra"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/mongo"
)

func NewRouter(_ *mongo.Database, col *mongo.Collection) http.Handler {

	app := &handlers.App{Col: col}

	router := chi.NewRouter()

	// Use() appends a middleware handler to the Mux middleware stack.
	//
	// The middleware stack for any Mux will execute before searching for a matching
	// route to a specific handler, which provides opportunity to respond early,
	// change the course of the request execution, or set request-scoped values for
	// the next http.Handler.
	router.Use(middleware.RequestID, middleware.RealIP, middleware.Logger, middleware.Recoverer)

	allow := cors.Options{
		// Why MustEnv is a thing? Doesnt that giveaway env values?
		AllowedOrigins: strings.Split(infra.MustEnv("CORS_ORIGINS", "http://localhost:5173"), ","),
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Content-Type", "Authorization"},
	}

	// New creates a new Cors handler with the provided options.
	router.Use(cors.New(allow).Handler)

	// Get adds the route `pattern` that matches a GET http method to
	// execute the `handlerFn` http.HandlerFunc.
	router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	router.Route("/api/appliances", func(r chi.Router) {
		router.Get("/", app.ListAppliances)
		router.Post("/", app.CreateNewAppliance)
		router.Put("/{id}", app.UpdateAppliance)
		router.Delete("/{id}", app.DeleteAppliance)
	})

	return router
}
