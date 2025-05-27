import React, { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ReferralTreeProps {
  user: any;
  referralTree: { level: number; users: any[] }[];
  loadingTree: boolean;
  activeLevel: number | null;
  onLevelChange: (level: number | null) => void;
}

const ReferralTree: React.FC<ReferralTreeProps> = ({
  user,
  referralTree,
  loadingTree,
  activeLevel,
  onLevelChange,
}) => {
  const [currentPage, setCurrentPage] = useState<{
    [key: number | string]: number;
  }>({});
  const itemsPerPage = 10;

  if (loadingTree) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handlePageChange = (level: number | null, page: number) => {
    setCurrentPage((prev) => ({
      ...prev,
      [level || "all"]: page,
    }));
  };

  const renderPagination = (level: number | null, totalUsers: number) => {
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    const currentPageNum = currentPage[level || "all"] || 1;

    // Hide pagination if there are 10 or fewer items
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4 flex justify-center">
        <PaginationContent>
          <PaginationItem>
            {currentPageNum > 1 ? (
              <PaginationPrevious
                onClick={() => handlePageChange(level, currentPageNum - 1)}
              />
            ) : (
              <PaginationPrevious className="pointer-events-none opacity-50" />
            )}
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(level, i + 1)}
                isActive={currentPageNum === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            {currentPageNum < totalPages ? (
              <PaginationNext
                onClick={() => handlePageChange(level, currentPageNum + 1)}
              />
            ) : (
              <PaginationNext className="pointer-events-none opacity-50" />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeLevel === null ? "default" : "outline"}
          size="sm"
          onClick={() => onLevelChange(null)}
        >
          All Levels
        </Button>
        {referralTree.map((level) => (
          <Button
            key={level.level}
            variant={activeLevel === level.level ? "default" : "outline"}
            size="sm"
            onClick={() => onLevelChange(level.level)}
          >
            Level {level.level}
          </Button>
        ))}
      </div>

      {referralTree
        .filter((level) => activeLevel === null || level.level === activeLevel)
        .map((level) => (
          <div key={level.level || "all"} className="space-y-4">
            {Array.isArray(level.users) && level.users.length > 0 && (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unique ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Email
                        </TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {level.users
                        .slice(
                          ((currentPage[level.level || "all"] || 1) - 1) *
                            itemsPerPage,
                          (currentPage[level.level || "all"] || 1) *
                            itemsPerPage
                        )
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.uniqueId}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {user.email}
                            </TableCell>
                            <TableCell>Level {level.level}</TableCell>
                            <TableCell>
                              ${Number(user.balance).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                {renderPagination(level.level, level.users.length)}
              </>
            )}
          </div>
        ))}
    </div>
  );
};

export default ReferralTree;
