// Types for header! :)
type Props = {
    hearts: number;
    percentage: number;
    hasActiveSubscription: boolean;
};

export const Header = ({ 
    hearts,
    percentage,
    hasActiveSubscription,
 }: Props) => {
    return (
        <div>
            Header
        </div>
    );
}