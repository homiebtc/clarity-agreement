# Agreement smart contract

A contract for determining if two parties are in agreement. Only the principal of each party can change decision or change party principal to another address.

## Usage

The contract exposes five main methods: `update-party-1-principal`, `update-party-2-principal`, `update-party-1-decision`, `update-party-2-decision`, and `is-agreement`.

### `update-party-1-principal`, `update-party-2-principal`

These methods change the state of `party-1-principal` and `party-2-principal` respectively. Only the current principals of each party can update the new principal.

### `update-party-1-decision`, `update-party-2-decision`

These methods change the state of `update-party-1-decision`, `update-party-2-decision` respectively. Only the current principals of each party can update the new decision.

### `is-agreement`

This method uses the current state of `party-1-decision` and `party-2-decision` and returns `true` if both are true, else `false`.
