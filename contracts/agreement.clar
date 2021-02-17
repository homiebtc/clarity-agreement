;; Clarity contract for determining if two parties are in agreement. 

;; define principal for party 1
(define-data-var party-1 principal 'STP6TH31V8VQ8R2XT00VQYTRCWB7CD6QZKNREP4B)

;; define decision for party 1, false is disagree, true is agree
(define-data-var party-1-decision bool false)

;; define address for party 2
(define-data-var party-2 principal 'ST1VYZX9900MPJE92VG3RNXEXXM4SWWAAT3M1X63J)

;; define decision for party 2, false is disagree, true is agree
(define-data-var party-2-decision bool false)

;; update party 1 principal
;; only current party 1 principal can update principal
(define-public (update-party-1-principal (updated-principal principal))
    (if
        (is-eq tx-sender (var-get party-1))
        (ok (var-set party-1 updated-principal))
        (err "This user cannot change party 1 principal")
    )
)

;; update party 2 principal
;; only current party 2 principal can update principal
(define-public (update-party-2-principal (updated-principal principal))
    (if
        (is-eq tx-sender (var-get party-2))
        (ok (var-set party-2 updated-principal))
        (err "This user cannot change party 2 principal")
    )
)

;; update party 1 decision
;; only the party 1 principal can update decision
(define-public (update-party-1-decision (updated-decision bool))
    (if
        (is-eq tx-sender (var-get party-1))
        (ok (var-set party-1-decision updated-decision))
        (err "This user cannot change party 1 decision")
    )
)

;; update party 2 decision
;; only the party 2 principal can update decision
(define-public (update-party-2-decision (updated-decision bool))
    (if
        (is-eq tx-sender (var-get party-2))
        (ok (var-set party-2-decision updated-decision))
        (err "This user cannot change party 2 decision")
    )
)

;; return true if both party 1 decision and party 2 decision are true, else false
(define-public (is-agreement)
    (ok (and (var-get party-1-decision)
            (var-get party-2-decision)
        )
    )
)

;; get principal for party 1
(define-read-only (get-current-party-1)
    (ok (var-get party-1))
)

;; get decision for party 1
(define-read-only (get-current-party-1-decision)
    (ok (var-get party-1-decision))
)

;; get principal for party 2
(define-read-only (get-current-party-2)
    (ok (var-get party-2))
)

;; get decision for party 2
(define-read-only (get-current-party-2-decision)
    (ok (var-get party-2-decision))
)
