package com.example.changekeeper;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatDialogFragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Calendar;

public class ConfirmDialogue2 extends AppCompatDialogFragment{
    //Class used to confirm
    private String walletAmount;
    private String cardAmount;
    private String current;
    private String amount;
    private ConfirmDialogListener2 listener;

    static ConfirmDialogue2 newInstance() {
        return new ConfirmDialogue2();
    }


    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        Log.i("boi","lol:)");
        getDialog().getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.layout_confirm_dialogue2,null);


        readFile();
        Bundle args = getArguments();

        String from = args.getString("sent").split(" ")[1];
        String to = args.getString("sent").split(" ")[3];
        Double amount = Double.parseDouble(args.getString("amount"));

        ((TextView)view.findViewById(R.id.typeText2)).setText("Confirm transfer from " + from +  " to "  + to);

        ((TextView)view.findViewById(R.id.transferAmount)).setText(amount+"€");

        ((TextView)view.findViewById(R.id.currentWallet)).setText(this.walletAmount+"€");
        ((TextView)view.findViewById(R.id.currentCard)).setText(this.cardAmount+"€");

        switch(from){
            case "Wallet":
                ((TextView)view.findViewById(R.id.afterWallet)).setText(Double.parseDouble(this.walletAmount)-amount+"€");
                ((TextView)view.findViewById(R.id.afterWallet)).setTextColor(Color.parseColor("#e74c3c"));

                ((ImageView)view.findViewById(R.id.imageView2)).setImageResource(R.drawable.ic_down);
                ((ImageView)view.findViewById(R.id.imageView9)).setImageResource(R.drawable.ic_up);

                ((TextView)view.findViewById(R.id.afterCard)).setTextColor(Color.parseColor("#2ecc71"));
                ((TextView)view.findViewById(R.id.afterCard)).setText(Double.parseDouble(this.cardAmount)+amount+"€");
                break;
            default:
                ((TextView)view.findViewById(R.id.afterWallet)).setText(Double.parseDouble(this.walletAmount)+amount+"€");

                ((ImageView)view.findViewById(R.id.imageView2)).setImageResource(R.drawable.ic_up);
                ((ImageView)view.findViewById(R.id.imageView9)).setImageResource(R.drawable.ic_down);
                ((TextView)view.findViewById(R.id.afterCard)).setTextColor(Color.parseColor("#e74c3c"));

                ((TextView)view.findViewById(R.id.afterWallet)).setTextColor(Color.parseColor("#2ecc71"));

                ((TextView)view.findViewById(R.id.afterCard)).setText(Double.parseDouble(this.cardAmount)-amount+"€");
        }


        Button butt  = view.findViewById(R.id.conf);
        butt.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.i("puto","lololo");
                listener.confirm(amount+"");
                dismiss();
            }
        });

        Button butt2  = view.findViewById(R.id.canc);
        butt2.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                dismiss();
            }
        });
        return view;
    }


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        try {
            listener = (ConfirmDialogListener2) context;
        } catch (ClassCastException e) {
            throw new ClassCastException((context.toString() + "Did not implement CategoryDialogueListener"));
        }
    }

    public interface ConfirmDialogListener2{
        void confirm(String confirm);
    }


    private void readFile() {
        try {
            FileInputStream fileInputStream = getActivity().openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            this.walletAmount = bufferedReader.readLine();
            this.cardAmount = bufferedReader.readLine();

            bufferedReader.close();
            inputStreamReader.close();
            fileInputStream.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}


