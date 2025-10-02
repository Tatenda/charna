import { useEffect, useState } from "react";
import Seo from "@/components/layout/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

interface Checkout {
  id: string;
  redirectUrl: string;
  status: string;
  amount: number;
  currency: string;
  paymentId?: string | null;
  processingMode?: string;
  metadata?: any;
  successUrl?: string | null;
  cancelUrl?: string | null;
  failureUrl?: string | null;
}

export default function TestPayments() {
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCheckouts = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await apiRequest("GET", "/api/test-payments/checkouts");
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to fetch checkouts");
      setCheckouts(Array.isArray(data.checkouts) ? data.checkouts : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch checkouts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const formatAmount = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(
      amount / 100,
    );

  return (
    <div className="bg-secondary-light min-h-screen">
      <Seo
        title="Test Payments"
        description="View recent Yoco test checkouts"
        url="/test-payments"
        robots="noindex, nofollow"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl font-semibold">Test Payments</h1>
          <Button
            onClick={fetchCheckouts}
            variant="outline"
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded">
            {error}
          </div>
        ) : checkouts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-neutral-600">
              No recent checkouts yet. Create one and refresh.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {checkouts.map((co) => (
              <Card key={co.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-mono">
                        {co.id}
                      </CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline">{co.status}</Badge>
                        {co.processingMode && (
                          <Badge variant="secondary">{co.processingMode}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        {formatAmount(co.amount, co.currency)}
                      </div>
                      {co.redirectUrl && (
                        <a
                          href={co.redirectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary underline"
                        >
                          Checkout Page
                        </a>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <div className="text-neutral-500">Payment</div>
                      <div>{co.paymentId ?? "Pending"}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500">Customer</div>
                      <div>{co?.metadata?.customer_name || "-"}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500">Mode</div>
                      <div>{co.processingMode || "test"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
