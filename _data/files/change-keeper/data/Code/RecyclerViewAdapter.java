package com.example.changekeeper;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.support.annotation.NonNull;
import android.support.constraint.ConstraintLayout;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;

public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerViewAdapter.ViewHolder>{
    private static final String TAG = "RecyclerViewAdapter";
    private ArrayList<String> infoList;
    private Context mContext;

    public static final String EXTRA_MESSAGE = "com.example.RecyclerViewAdapter.MESSAGE";


    public RecyclerViewAdapter(ArrayList<String> infoList, Context context){
        this.infoList = infoList;
        this.mContext = context;
        Log.i(TAG,"BOOOOOOI" + this.mContext.getClass().toString());

    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.fragment_info_table_item,parent,false);
        ViewHolder holder = new ViewHolder(view);
        return holder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, final int position) {
        Log.i(TAG,"onBindViewHolder: called");

        //Format: WALLET/CARD - Amount - Date - Person(NULL UNLESS LOAN) - Category (NULL UNLESS EXPENSE)- FrequencyType (NULL IF LOAN) - Frequency (NULL IF LOAN) - Weekdays (NULL IF LOAN) - Description
        Log.i(TAG,"ELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO " + infoList.get(position));

        if(infoList.get(position).split(" - ")[8].length()<20)
            viewHolder.description.setText(infoList.get(position).split(" - ")[8]);
        else
            viewHolder.description.setText(infoList.get(position).split(" - ")[8].substring(0,17)+"...");

        viewHolder.date.setText(infoList.get(position).split(" - ")[2]);
        String amount = infoList.get(position).split(" - ")[1];
        viewHolder.amount.setText(amount+"€");

        if(amount.contains("-")){
            viewHolder.amount.setTextColor(Color.parseColor("#e74c3c"));
        }else{
            viewHolder.amount.setTextColor(Color.parseColor("#2ecc71"));
        }

        viewHolder.walletOrCard.setText(infoList.get(position).split(" - ")[0]);

        viewHolder.parentLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.i(TAG,infoList.get(position));

                if(!infoList.get(position).split(" - ")[3].equals("NULL")){
                    //Loan
                    Log.i(TAG,"GOING TO LOAN DETAILS");
                    Intent intent;
                    if(mContext.getClass().equals(GraphsScreen.class))
                        intent  = new Intent(mContext, GraphsLoanMoreInfoScreen.class);
                    else
                        intent = new Intent(mContext, LoansLoanMoreInfoScreen.class);

                    String message = infoList.get(position);
                    intent.putExtra(EXTRA_MESSAGE, message);
                    mContext.startActivity(intent);
                }
                else if(!infoList.get(position).split(" - ")[4].equals("NULL")){
                    //Expense
                    Log.i(TAG,"GOING TO EXPENSE DETAILS");
                    Intent intent;
                    if(mContext.getClass().equals(GraphsScreen.class))
                        intent  = new Intent(mContext, GraphsSubscriptionMoreInfoScreen.class);
                    else
                        intent = new Intent(mContext, SubscriptionMoreInfoScreen.class);

                    String message = infoList.get(position);
                    intent.putExtra(EXTRA_MESSAGE, message);
                    mContext.startActivity(intent);
                }
                else{
                    //Income
                    Log.i(TAG,"GOING TO INCOME DETAILS");
                    Intent intent;
                    if(mContext.getClass().equals(GraphsScreen.class))
                       intent  = new Intent(mContext, GraphsAllowanceMoreInfoScreen.class);
                    else
                        intent = new Intent(mContext, AllowanceMoreInfoScreen.class);
                    String message = infoList.get(position);
                    intent.putExtra(EXTRA_MESSAGE, message);
                    mContext.startActivity(intent);

                }
            }
        });

        if(infoList.get(position).split(" - ")[4].equals("NULL")){
            if(!infoList.get(position).split(" - ")[3].equals("NULL")){
                //Loan
                if(amount.contains("-")){
                    viewHolder.type.setText("Loan");
                    viewHolder.image.setImageResource(R.drawable.ic_lend);
                }else{
                    viewHolder.type.setText("Debt");
                    viewHolder.image.setImageResource(R.drawable.ic_borrow);
                }
            }
            else{
                //Income
                viewHolder.type.setText("Income");
                viewHolder.image.setImageResource(R.drawable.ic_income);

            }
        }else{
            switch (infoList.get(position).split(" - ")[4]){
                case "Non-Specified":
                    viewHolder.type.setText("Non-Specified");
                    viewHolder.image.setImageResource(R.drawable.ic_other);
                    break;
                case "Recreational":
                    viewHolder.type.setText("Recreational");
                    viewHolder.image.setImageResource(R.drawable.ic_recreational);
                    break;
                case "Food":
                    viewHolder.type.setText("Food");
                    viewHolder.image.setImageResource(R.drawable.ic_food);
                    break;

                case "Debt payment":
                    viewHolder.type.setText("Debt Payment");
                    viewHolder.image.setImageResource(R.drawable.ic_expense);
                    break;

                default:
                    String temp = infoList.get(position).split(" - ")[4];
                    Log.i("SDO", "SDIJ" + temp);

                    int resID = viewHolder.parentLayout.getResources().getIdentifier(temp.split(" -@OMEGALMAO@- ")[1],
                            "drawable", viewHolder.parentLayout.getContext().getPackageName());

                    viewHolder.image.setImageResource(resID);

                    if(temp.split(" -@OMEGALMAO@- ")[0].length()<17)
                        viewHolder.type.setText(temp.split(" -@OMEGALMAO@- ")[0]);
                    else
                        viewHolder.type.setText(temp.split(" -@OMEGALMAO@- ")[0].substring(0,14)+"...");
                    break;
            }
        }

    }

    @Override
    public int getItemCount() {
        return this.infoList.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{

        TextView description;
        TextView date;
        TextView amount;
        TextView type;
        TextView walletOrCard;
        ImageView image;
        ConstraintLayout parentLayout;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            description = itemView.findViewById(R.id.fromInput);
            date = itemView.findViewById(R.id.regDate);
            amount = itemView.findViewById(R.id.amount);
            walletOrCard = itemView.findViewById(R.id.type2);;
            type = itemView.findViewById(R.id.type);
            image = itemView.findViewById(R.id.imageView7);

            parentLayout = itemView.findViewById(R.id.infoTableItem);

        }
    }
}
