package handler

import (
    "fmt"
    "net/http"
    "strings"
    "io/ioutil"
    "os"
)

var (
    fileshare = os.Getenv("FILESHARE_URL")
)

// Handler Handler
func Handler(w http.ResponseWriter, r *http.Request) {
    fmt.Printf("fileshare url at %s\n", fileshare)
    if fileshare == "" {
        w.WriteHeader(404)
        fmt.Fprintf(w, "no fileshare available")
        return
    }
    filename := r.FormValue("file")
    fileshareURL := fmt.Sprintf("%s%s", fileshare, filename)
    fmt.Printf("fileshareurl %s\n", fileshareURL)
    resp, err := http.Get(fileshareURL)
    if err != nil {
        w.WriteHeader(404)
        fmt.Fprintf(w, "An error happened %v\n", err)
        return 
    }
    defer resp.Body.Close()
    bodyBytes, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        w.WriteHeader(404)
        fmt.Fprintf(w, "An error happened %v\n", err)
        return 
    }
    body := strings.TrimSpace(string(bodyBytes))
    if strings.HasPrefix(body, "error:") {
        w.WriteHeader(404)
        fmt.Fprintf(w, body)
        return
    }
    fmt.Printf("redirecting to %s\n", body)
    http.Redirect(w, r, body, 307)
}
