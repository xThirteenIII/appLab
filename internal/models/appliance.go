package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Order fields from heavier to lighter, byte-wise, to save memory.
// The compiler adds “empty” bytes to align each field to its natural alignment boundary (which depends on the size of the type).
type Appliance struct {
	UpdatedAt     time.Time          `bson:"updatedAt" json:"updatedAt"`// 24B (struct with uint64 and int64)
	Features      []string           `bson:"features" json:"features"`// 24B (ptr + len + cap, 8B each)
	Bugs          []string           `bson:"bugs" json:"bugs"`// 24B
	Model         string             `bson:"model" json:"model"`// 16B
	Serial        string             `bson:"serial" json:"serial"`// 16B
	FWVersion     string             `bson:"fwVersion" json:"fwVersion"`// 16B
	UserStory     string             `bson:"testExecution" json:"testExecution"`// 16B
	TestExecution string             `bson:"userStory" json:"userStory"`// 16B
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"` // 12B (aligned to 16B)
	InLabCount    int                `bson:"inLabCount" json:"inLabCount"`// 8B
	Ready         bool               `bson:"ready" json:"ready"`// 1B
}
