package infra

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func InitMgo (ctx context.Context) (*mongo.Database, *mongo.Collection){
	uri := MustEnv("MONGO_URI", "")
	dbName := MustEnv("DB_NAME", "applab")

	mgoClient, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}

	if err := mgoClient.Ping(ctx, nil); err != nil {
		log.Fatal(err)
	}

	db := mgoClient.Database(dbName)
	col := db.Collection("appliances")

	// create unique index, which is model + serial
	_, _ = col.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: bson.D{{Key: "model", Value: 1}, {Key: "serial", Value: 1}},
		Options: options.Index().SetUnique(true),
	})

	return db, col
}
