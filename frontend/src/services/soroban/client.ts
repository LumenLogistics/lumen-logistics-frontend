import {
  rpc,
  Account,
  Keypair,
  Contract,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  nativeToScVal,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import { getAddress, signTransaction } from "@stellar/freighter-api";

const SOROBAN_RPC_URL =
  import.meta.env.VITE_SOROBAN_RPC_URL ??
  "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE =
  import.meta.env.VITE_STELLAR_NETWORK ?? Networks.TESTNET;

let server: rpc.Server | null = null;

function getServer(): rpc.Server {
  if (!server) {
    server = new rpc.Server(SOROBAN_RPC_URL);
  }
  return server;
}

// All callable methods on the OrbitHaul Shipment contract
export type ContractMethod =
  // Admin & init
  | "initialize"
  | "initialize_multisig"
  | "update_config"
  | "upgrade"
  | "transfer_admin"
  | "accept_admin"
  | "propose_action"
  | "approve_action"
  | "execute_proposal"
  | "get_admin"
  | "get_version"
  | "get_contract_metadata"
  | "pause"
  | "unpause"
  | "is_paused"
  // Role management
  | "add_company"
  | "add_carrier"
  | "add_guardian"
  | "add_operator"
  | "revoke_role"
  | "suspend_carrier"
  | "reactivate_carrier"
  | "get_role"
  // Shipment lifecycle
  | "create_shipment"
  | "create_shipments_batch"
  | "update_status"
  | "cancel_shipment"
  | "force_cancel_shipment"
  | "confirm_delivery"
  | "confirm_partial_delivery"
  | "handoff_shipment"
  | "archive_shipment"
  | "check_deadline"
  | "update_eta"
  | "set_shipment_metadata"
  // Queries
  | "get_shipment"
  | "get_shipments_batch"
  | "get_shipment_count"
  | "get_shipment_sender"
  | "get_shipment_receiver"
  | "get_shipment_carrier"
  | "get_shipment_creator"
  | "get_shipment_reference"
  | "get_status_summary"
  | "get_shipments_by_status"
  | "get_active_shipment_count"
  | "get_shipment_limit"
  | "set_shipment_limit"
  | "set_company_shipment_limit"
  // Escrow
  | "deposit_escrow"
  | "release_escrow"
  | "refund_escrow"
  | "get_escrow_balance"
  | "release_milestone_payment"
  // Milestones
  | "record_milestone"
  | "record_milestones_batch"
  | "confirm_milestone"
  | "release"
  | "get_state"
  // Disputes
  | "raise_dispute"
  | "resolve_dispute"
  | "add_dispute_evidence_hash"
  // IoT & conditions
  | "report_condition_breach"
  | "report_geofence_event"
  | "verify_data_hash"
  | "submit_iot_reading"
  // Notes
  | "append_note_hash"
  | "get_note_hash"
  // Analytics & diagnostics
  | "get_analytics"
  | "get_health_score"
  | "get_ttl_health_summary"
  | "check_all_consistency"
  | "restore_persistent_diagnostics"
  | "get_event_count"
  | "get_hash_algo_version"
  | "get_canonical_hash"
  // Carrier whitelist
  | "add_carrier_to_whitelist"
  | "remove_carrier_from_whitelist"
  | "is_carrier_whitelisted"
  | "list_company_carriers"
  // Quotas
  | "set_creation_quota"
  | "get_creation_quota_status"
  // Fees
  | "set_fee_config"
  | "get_fee_config";

export async function callContractMethod(
  contractId: string,
  method: ContractMethod,
  args: xdr.ScVal[] = [],
): Promise<string> {
  const { address: pubKey } = await getAddress();
  const contract = new Contract(contractId);
  const sorobanServer = getServer();

  const account = await sorobanServer.getAccount(pubKey);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const preparedTx = await sorobanServer.prepareTransaction(tx);

  const { signedTxXdr } = await signTransaction(preparedTx.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  const signedTx = TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE);

  const result = await sorobanServer.sendTransaction(signedTx);
  return result.hash;
}

export async function readContractState<T>(
  contractId: string,
  method: string,
  args: xdr.ScVal[] = [],
): Promise<T> {
  const contract = new Contract(contractId);
  const sorobanServer = getServer();

  const dummyAccount = new Account(Keypair.random().publicKey(), "0");
  const tx = new TransactionBuilder(dummyAccount, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const result = await sorobanServer.simulateTransaction(tx);

  if (!("result" in result) || !result.result) {
    throw new Error(`Simulation failed for ${method}`);
  }

  return scValToNative(result.result.retval) as T;
}

export function toScVal(value: unknown): xdr.ScVal {
  return nativeToScVal(value);
}

export { rpc, Networks };
