package handlers

import (
	"applab/api/internal/models"
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Appliance struct {
	Col *mongo.Collection
}

// Basic Create Read Update and Delete operations

// This will be a GET request
func (a *Appliance) ListAppliances(w http.ResponseWriter, r *http.Request) {

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	// Find executes a find command and returns a Cursor over the matching documents in the collection.
	cursor, err := a.Col.Find(ctx, bson.D{}, options.Find().SetSort(bson.D{{Key: "updatedAt", Value: -1}}))
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer cursor.Close(ctx)

	var list []models.Appliance
	if err := cursor.All(ctx, &list); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	json.NewEncoder(w).Encode(list)

}

// This will be a POST request
func (a *Appliance) CreateNewAppliance(w http.ResponseWriter, r *http.Request) {
	var newAppliance models.Appliance
	if err := json.NewDecoder(r.Body).Decode(&newAppliance); err != nil {
		http.Error(w, "invalid JSON", 400)
		return
	}
	newAppliance.UpdatedAt = time.Now()
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()
	res, err := a.Col.InsertOne(ctx, newAppliance)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	newAppliance.ID = res.InsertedID.(primitive.ObjectID)
	json.NewEncoder(w).Encode(newAppliance)
}

// This will be a POST request.
// This will be split into different methods to update single fields.
func (a *Appliance) UpdateAppliance(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	objectID, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		http.Error(w, "invalid id", 400)
		return
	}
	var updatedAppliance models.Appliance
	if err := json.NewDecoder(r.Body).Decode(&updatedAppliance); err != nil {
		http.Error(w, "invalid JSON", 400)
		return
	}
	updatedAppliance.UpdatedAt = time.Now()
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()
	_, err = a.Col.UpdateByID(ctx, objectID, bson.M{"$set": updatedAppliance})
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	updatedAppliance.ID = objectID
	json.NewEncoder(w).Encode(updatedAppliance)
}

func (a *Appliance) DeleteAppliance(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	obojectID, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		http.Error(w, "invalid id", 400)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()
	_, err = a.Col.DeleteOne(ctx, bson.M{"_id": obojectID})
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
}
