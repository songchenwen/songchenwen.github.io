package handler

import (
    "fmt"
    "net/http"
    "os"
)

var (
    airport = os.Getenv("AIRPORT")
)

// Handler Handler
func Handler(w http.ResponseWriter, r *http.Request) {
    if airport == "" {
        w.WriteHeader(404)
        fmt.Fprintf(w, "no airport available")
        return
    }
    http.Redirect(w, r, airport, 307)
}
